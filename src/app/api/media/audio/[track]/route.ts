import { NextResponse } from "next/server";
import { requireBuilder } from "@/lib/vault-session";
import { trackById } from "@/lib/tracks";
import { signedStorageUrl, streamLocalFile } from "@/lib/media";

export const runtime = "nodejs";

/**
 * The Audio Vault's only door. Entitlement-checked, then either a
 * short-TTL Supabase signed URL (production) or a Range-aware local
 * stream from assets/ (dev).
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ track: string }> }
) {
  const builder = await requireBuilder();
  if (!builder) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { track: trackId } = await params;
  const track = trackById(trackId);
  if (!track) return NextResponse.json({ error: "unknown track" }, { status: 404 });

  const signed = await signedStorageUrl("audio-vault", track.object);
  if (signed) return NextResponse.redirect(signed, 307);

  return streamLocalFile(track.file, req.headers.get("range"), "audio/mpeg");
}
