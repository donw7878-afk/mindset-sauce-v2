import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Builder Assessment lead capture.
 *
 * Stores: name, email, Builder Readiness™, Builder Archetype™,
 * Primary Obstacle™, Builder Number™, raw answers, timestamp.
 *
 * Current storage: local NDJSON at .data/leads.ndjson (dev-safe fallback).
 *
 * PENDING INTEGRATIONS (need credentials/provider choice):
 *  - Supabase `leads` table insert (replaces the NDJSON append verbatim).
 *  - Transactional email: send coupon BUILDER97 immediately on capture.
 *  - Nurture: enroll in the 12-email sequence (every other day) until
 *    purchase; on purchase webhook, remove from nurture and enroll in
 *    Builder onboarding. This belongs in the email platform's automation,
 *    triggered from here (add-to-list) and from the Stripe webhook
 *    (move-to-list).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const { name, email, score, answers, archetype, obstacle, builderNumber } =
    (body ?? {}) as {
      name?: string;
      email?: string;
      score?: number;
      answers?: number[];
      archetype?: string;
      obstacle?: string;
      builderNumber?: string;
    };

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ||
    typeof score !== "number" ||
    !Array.isArray(answers)
  ) {
    return NextResponse.json({ ok: false, error: "invalid lead" }, { status: 400 });
  }

  const lead = {
    name: name.trim().slice(0, 120),
    email: email.trim().toLowerCase().slice(0, 200),
    // Builder Readiness™ (0–100)
    score: Math.max(0, Math.min(100, Math.round(score))),
    answers: answers.slice(0, 20).map((a) => Number(a)),
    archetype: typeof archetype === "string" ? archetype.slice(0, 80) : undefined,
    obstacle: typeof obstacle === "string" ? obstacle.slice(0, 80) : undefined,
    builderNumber:
      typeof builderNumber === "string" ? builderNumber.slice(0, 12) : undefined,
    coupon: "BUILDER97",
    capturedAt: new Date().toISOString(),
  };

  let stored = false;
  try {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "leads.ndjson"), JSON.stringify(lead) + "\n", "utf8");
    stored = true;
  } catch (err) {
    // Serverless filesystems are read-only — never fail the visitor for it.
    console.error("[lead] storage failed:", err);
    console.log("[lead] capture:", JSON.stringify(lead));
  }

  return NextResponse.json({ ok: true, stored });
}
