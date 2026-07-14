import { NextResponse } from "next/server";
import { requireBuilder } from "@/lib/vault-session";
import { recordChapterComplete } from "@/lib/vault";

export const runtime = "nodejs";

/** Seals a chapter. The ritual order is enforced server-side. */
export async function POST(req: Request) {
  const builder = await requireBuilder();
  if (!builder) return NextResponse.json({ ok: false }, { status: 401 });

  let module = 0;
  let chapter = 0;
  try {
    const body = (await req.json()) as { module?: number; chapter?: number };
    module = Number(body.module);
    chapter = Number(body.chapter);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  try {
    const result = await recordChapterComplete(builder, module, chapter);
    return NextResponse.json(result, { status: result.ok ? 200 : 409 });
  } catch (err) {
    console.error("[vault] progress write failed:", err);
    return NextResponse.json({ ok: false, error: "storage" }, { status: 500 });
  }
}
