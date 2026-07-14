import { NextResponse } from "next/server";
import { requireBuilder } from "@/lib/vault-session";
import { checkinExecutable } from "@/lib/vault";

export const runtime = "nodejs";

/** Today's Executable check-in — marks the day active, one win per day. */
export async function POST() {
  const builder = await requireBuilder();
  if (!builder) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await checkinExecutable(builder);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[vault] checkin failed:", err);
    return NextResponse.json({ ok: false, error: "storage" }, { status: 500 });
  }
}
