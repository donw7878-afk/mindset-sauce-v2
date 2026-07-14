import { NextResponse } from "next/server";
import { requireBuilder } from "@/lib/vault-session";
import { saveAudioPosition } from "@/lib/vault";
import { trackById } from "@/lib/tracks";

export const runtime = "nodejs";

/**
 * Persists playback position so every player resumes where the Builder
 * left off — on any device. Accepts sendBeacon payloads (text/plain).
 */
export async function POST(req: Request) {
  const builder = await requireBuilder();
  if (!builder) return NextResponse.json({ ok: false }, { status: 401 });

  let payload: { track?: string; seconds?: number; duration?: number };
  try {
    payload = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const track = trackById(String(payload.track ?? ""));
  const seconds = Number(payload.seconds);
  if (!track || !Number.isFinite(seconds)) {
    return NextResponse.json({ ok: false, error: "invalid position" }, { status: 400 });
  }

  try {
    await saveAudioPosition(
      builder.id,
      track.id,
      seconds,
      Number.isFinite(Number(payload.duration)) ? Number(payload.duration) : undefined
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[vault] position save failed:", err);
    return NextResponse.json({ ok: false, error: "storage" }, { status: 500 });
  }
}
