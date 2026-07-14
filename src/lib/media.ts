import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Protected media delivery. Production: private Supabase Storage buckets
 * (`audio-vault`, `archive`) behind short-TTL signed URLs. Dev fallback:
 * stream straight from assets/ with Range support so scrubbing works.
 * Callers must have already checked the session.
 */

const SIGNED_URL_TTL = 60 * 60; // seconds

/** Objects confirmed absent from Storage — skip the round-trip for a while. */
const missing = new Map<string, number>();
const MISSING_TTL_MS = 10 * 60 * 1000;

export async function signedStorageUrl(
  bucket: string,
  object: string
): Promise<string | null> {
  if (!supabaseConfigured) return null;
  const cacheKey = `${bucket}/${object}`;
  const missedAt = missing.get(cacheKey);
  if (missedAt && Date.now() - missedAt < MISSING_TTL_MS) return null;

  try {
    const { data, error } = await supabaseAdmin()
      .storage.from(bucket)
      .createSignedUrl(object, SIGNED_URL_TTL);
    if (error || !data?.signedUrl) {
      missing.set(cacheKey, Date.now());
      return null;
    }
    return data.signedUrl;
  } catch {
    missing.set(cacheKey, Date.now());
    return null;
  }
}

/** Streams a repo-local file, honoring Range requests (audio scrubbing). */
export async function streamLocalFile(
  relPath: string,
  rangeHeader: string | null,
  contentType: string,
  disposition?: string
): Promise<Response> {
  const absPath = path.join(process.cwd(), relPath);
  let size: number;
  try {
    size = (await stat(absPath)).size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const baseHeaders: Record<string, string> = {
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
  };
  if (disposition) baseHeaders["Content-Disposition"] = disposition;

  const m = rangeHeader?.match(/bytes=(\d*)-(\d*)/);
  if (m && (m[1] || m[2])) {
    const start = m[1] ? parseInt(m[1], 10) : Math.max(0, size - parseInt(m[2], 10));
    const end = m[1] && m[2] ? Math.min(parseInt(m[2], 10), size - 1) : size - 1;
    if (!Number.isFinite(start) || start >= size || start > end) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }
    const stream = Readable.toWeb(
      createReadStream(absPath, { start, end })
    ) as ReadableStream;
    return new Response(stream, {
      status: 206,
      headers: {
        ...baseHeaders,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  const stream = Readable.toWeb(createReadStream(absPath)) as ReadableStream;
  return new Response(stream, {
    status: 200,
    headers: { ...baseHeaders, "Content-Length": String(size) },
  });
}
