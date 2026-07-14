import { appendFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { resend, FROM, REPLY_TO } from "./resend";
import { couponEmail, type LeadRecord } from "./coupon";
import { NURTURE_SEQUENCE } from "./nurture";
import { htmlToText } from "./template";
import {
  unsubscribeUrl,
  unsubscribeHeaders,
  withUnsubscribeLink,
} from "./unsubscribe";
import { supabaseAdmin, supabaseConfigured } from "../supabase";

/**
 * Nurture enrollment: the entire 12-letter sequence is scheduled with
 * Resend `scheduled_at` at capture time (day 1–23, inside Resend's
 * 30-day window — verified live), and the Stripe webhook cancels
 * whatever hasn't sent yet when the Builder purchases.
 *
 * State lives in Supabase `nurture_emails` (production — Vercel's
 * filesystem is read-only). `.data/nurture.ndjson` remains as the dev
 * fallback and is still read at cancel time so older local enrollments
 * aren't orphaned.
 */

const DATA_DIR = () => path.join(process.cwd(), ".data");
const NURTURE_FILE = () => path.join(DATA_DIR(), "nurture.ndjson");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function recordFallback(line: object) {
  await mkdir(DATA_DIR(), { recursive: true });
  await appendFile(NURTURE_FILE(), JSON.stringify(line) + "\n", "utf8");
}

async function recordEnrollment(email: string, ids: string[]) {
  if (supabaseConfigured) {
    const { error } = await supabaseAdmin()
      .from("nurture_emails")
      .insert({ email, resend_ids: ids });
    if (!error) return;
    console.error("[email] nurture state insert failed:", error);
  }
  await recordFallback({ email, ids, enrolledAt: new Date().toISOString() });
}

/**
 * Fires the Builder Report email now and schedules the 12 Builder
 * Letters. Never throws — email is a gift, not a gate.
 */
export async function enrollLead(lead: LeadRecord): Promise<void> {
  // 1. The coupon email — transactional, from vault@, immediately.
  try {
    const { subject, html } = couponEmail(lead);
    const { error } = await resend.emails.send({
      from: FROM.vault,
      replyTo: REPLY_TO,
      to: [lead.email],
      subject,
      html,
      text: htmlToText(html),
    });
    if (error) console.error("[email] coupon send failed:", error);
  } catch (err) {
    console.error("[email] coupon send threw:", err);
  }

  // 2. The Builder Letters — scheduled, throttled under Resend's 2 req/s.
  const ids: string[] = [];
  const unsubUrl = unsubscribeUrl(lead.email, "nurture");
  for (const letter of NURTURE_SEQUENCE) {
    try {
      await sleep(600);
      const at = new Date(Date.now() + letter.day * 24 * 60 * 60 * 1000);
      const html = withUnsubscribeLink(letter.html(lead), unsubUrl);
      const { data, error } = await resend.emails.send({
        from: FROM[letter.from],
        replyTo: REPLY_TO,
        to: [lead.email],
        subject: letter.subject(lead),
        html,
        text: htmlToText(html),
        headers: unsubscribeHeaders(lead.email, "nurture"),
        scheduledAt: at.toISOString(),
      });
      if (error) {
        console.error(`[email] letter ${letter.day} schedule failed:`, error);
      } else if (data?.id) {
        ids.push(data.id);
      }
    } catch (err) {
      console.error(`[email] letter ${letter.day} threw:`, err);
    }
  }

  try {
    await recordEnrollment(lead.email.trim().toLowerCase(), ids);
  } catch (err) {
    console.error("[email] nurture state write failed:", err, "ids:", ids);
  }
}

/** Still-pending ids from the local ndjson file (dev / legacy). */
async function fallbackIds(target: string): Promise<Set<string>> {
  const ids = new Set<string>();
  let lines: string[] = [];
  try {
    lines = (await readFile(NURTURE_FILE(), "utf8")).split("\n").filter(Boolean);
  } catch {
    return ids;
  }
  for (const line of lines) {
    try {
      const entry = JSON.parse(line) as {
        email?: string;
        ids?: string[];
        cancelledAt?: string;
      };
      if (entry.email?.toLowerCase() !== target) continue;
      if (entry.ids) entry.ids.forEach((id) => ids.add(id));
      if (entry.cancelledAt) ids.clear(); // already handled earlier
    } catch {
      /* skip malformed line */
    }
  }
  return ids;
}

/**
 * Called by the Stripe webhook on purchase: cancel every still-scheduled
 * letter for this address. Already-sent letters 404/422 — ignored.
 */
export async function cancelNurture(email: string): Promise<number> {
  const target = email.trim().toLowerCase();
  const ids = new Set<string>();
  const supabaseRowIds: string[] = [];

  if (supabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin()
        .from("nurture_emails")
        .select("id, resend_ids, cancelled_at")
        .eq("email", target);
      if (error) throw error;
      for (const row of data ?? []) {
        if (row.cancelled_at) continue;
        supabaseRowIds.push(row.id);
        for (const id of row.resend_ids ?? []) ids.add(id);
      }
    } catch (err) {
      console.error("[email] nurture state read failed:", err);
    }
  }
  for (const id of await fallbackIds(target)) ids.add(id);

  let cancelled = 0;
  for (const id of ids) {
    try {
      await sleep(600);
      const { error } = await resend.emails.cancel(id);
      if (!error) cancelled++;
    } catch {
      /* already sent or already cancelled — fine */
    }
  }

  if (ids.size > 0) {
    if (supabaseRowIds.length > 0) {
      try {
        await supabaseAdmin()
          .from("nurture_emails")
          .update({ cancelled_at: new Date().toISOString() })
          .in("id", supabaseRowIds);
      } catch (err) {
        console.error("[email] nurture cancel marker failed:", err);
      }
    }
    try {
      await recordFallback({ email: target, cancelledAt: new Date().toISOString() });
    } catch {
      /* read-only filesystem in production — Supabase marker is the record */
    }
  }
  return cancelled;
}
