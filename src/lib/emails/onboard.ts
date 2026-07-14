import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { resend, FROM, REPLY_TO } from "./resend";
import { ONBOARDING_SEQUENCE, type BuilderLike } from "./onboarding";
import { htmlToText } from "./template";
import {
  unsubscribeUrl,
  unsubscribeHeaders,
  withUnsubscribeLink,
} from "./unsubscribe";
import { supabaseAdmin, supabaseConfigured } from "../supabase";

/**
 * The Builder Path enrollment. The Stripe webhook calls this once per
 * purchase (via after(), so Stripe gets its 200 immediately): all seven
 * letters are scheduled with Resend `scheduled_at` (days 0–21, inside
 * the 30-day window), and the ids are recorded in Supabase
 * `onboarding_emails` so the sequence can be cancelled (e.g. refund).
 *
 * Idempotent per address: an existing enrollment row means a Stripe
 * retry or repeat purchase schedules nothing twice.
 * Never throws — email is a gift, not a gate.
 */

const NDJSON = () => path.join(process.cwd(), ".data", "onboarding.ndjson");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function recordFallback(line: object) {
  await mkdir(path.dirname(NDJSON()), { recursive: true });
  await appendFile(NDJSON(), JSON.stringify(line) + "\n", "utf8");
}

async function alreadyEnrolled(email: string): Promise<boolean> {
  if (!supabaseConfigured) return false;
  const { data, error } = await supabaseAdmin()
    .from("onboarding_emails")
    .select("id")
    .eq("email", email)
    .limit(1);
  if (error) {
    console.error("[onboard] enrollment lookup failed:", error);
    return false; // fail open — better a duplicate letter than none
  }
  return (data ?? []).length > 0;
}

export async function enrollOnboarding(builder: BuilderLike): Promise<number> {
  const email = builder.email.trim().toLowerCase();
  if (!email) return 0;

  try {
    if (await alreadyEnrolled(email)) {
      console.log(`[onboard] ${email} already on the Builder Path — skipping`);
      return 0;
    }
  } catch (err) {
    console.error("[onboard] enrollment check threw:", err);
  }

  const ids: string[] = [];
  const now = Date.now();
  const unsubUrl = unsubscribeUrl(email, "onboarding");
  for (const letter of ONBOARDING_SEQUENCE) {
    try {
      await sleep(600); // Resend allows 2 req/s
      const at = new Date(
        now + letter.day * 24 * 60 * 60 * 1000 + (letter.hours ?? 0) * 60 * 60 * 1000
      );
      const html = withUnsubscribeLink(letter.html(builder), unsubUrl);
      const { data, error } = await resend.emails.send({
        from: FROM[letter.from],
        replyTo: REPLY_TO,
        to: [email],
        subject: letter.subject(builder),
        html,
        text: htmlToText(html),
        headers: unsubscribeHeaders(email, "onboarding"),
        scheduledAt: at.toISOString(),
      });
      if (error) {
        console.error(`[onboard] letter day ${letter.day} schedule failed:`, error);
      } else if (data?.id) {
        ids.push(data.id);
      }
    } catch (err) {
      console.error(`[onboard] letter day ${letter.day} threw:`, err);
    }
  }

  try {
    if (supabaseConfigured) {
      const { error } = await supabaseAdmin()
        .from("onboarding_emails")
        .insert({ email, resend_ids: ids });
      if (error) throw error;
    } else {
      await recordFallback({ email, ids, enrolledAt: new Date().toISOString() });
    }
  } catch (err) {
    console.error("[onboard] state write failed:", err, "ids:", ids);
    try {
      await recordFallback({ email, ids, enrolledAt: new Date().toISOString() });
    } catch {
      /* the console line above is the last-resort record */
    }
  }
  return ids.length;
}

/**
 * Cancels every still-scheduled Builder Path letter for this address
 * (refunds). Already-sent letters 404/422 at Resend — ignored.
 */
export async function cancelOnboarding(email: string): Promise<number> {
  if (!supabaseConfigured) return 0;
  const target = email.trim().toLowerCase();
  const { data, error } = await supabaseAdmin()
    .from("onboarding_emails")
    .select("id, resend_ids, cancelled_at")
    .eq("email", target);
  if (error || !data?.length) return 0;

  let cancelled = 0;
  for (const row of data) {
    if (row.cancelled_at) continue;
    for (const id of row.resend_ids ?? []) {
      try {
        await sleep(600);
        const { error: cancelErr } = await resend.emails.cancel(id);
        if (!cancelErr) cancelled++;
      } catch {
        /* already sent or already cancelled — fine */
      }
    }
    await supabaseAdmin()
      .from("onboarding_emails")
      .update({ cancelled_at: new Date().toISOString() })
      .eq("id", row.id);
  }
  return cancelled;
}
