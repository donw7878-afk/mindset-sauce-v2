import { NextResponse, after } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { enrollLead } from "@/lib/emails/enroll";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

/**
 * Builder Assessment lead capture.
 *
 * Stores: name, email, Builder Readiness™, Builder Archetype™,
 * Primary Obstacle™, Builder Number™, raw answers, timestamp.
 *
 * Email (Resend, via after() so the reveal is never delayed):
 *  - The Builder Report email with coupon BUILDER97, from vault@, now.
 *  - The 12 Builder Letters scheduled every other day (days 1–23);
 *    the Stripe webhook cancels the unsent ones on purchase.
 *
 * Storage: Supabase `leads` table (production), with the local NDJSON
 * append at .data/leads.ndjson kept as a dev-safe fallback.
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
  if (supabaseConfigured) {
    try {
      const { error } = await supabaseAdmin().from("leads").insert({
        email: lead.email,
        name: lead.name,
        score: lead.score,
        archetype: lead.archetype ?? null,
        obstacle: lead.obstacle ?? null,
        builder_number: lead.builderNumber ?? null,
        answers: lead.answers,
        coupon: lead.coupon,
      });
      if (error) throw error;
      stored = true;
    } catch (err) {
      console.error("[lead] supabase insert failed:", err);
    }
  }
  if (!stored) {
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
  }

  // Coupon email + the 12 Builder Letters, after the response is sent —
  // the reveal ceremony never waits on thirteen Resend calls.
  after(() => enrollLead(lead));

  return NextResponse.json({ ok: true, stored });
}
