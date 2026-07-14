import { createHmac, timingSafeEqual } from "crypto";
import { SITE_URL } from "./resend";
import { emailStyles } from "./template";

/**
 * One-click unsubscribe for the scheduled sequences — required by Gmail
 * and Yahoo for bulk senders since 2024. Links are HMAC-signed so only
 * addresses we mailed can be unsubscribed, and the endpoint cancels the
 * rest of the sequence at Resend.
 */

export type UnsubList = "nurture" | "onboarding";

function sign(email: string, list: UnsubList): string {
  return createHmac("sha256", process.env.AUTH_SECRET ?? "")
    .update(`unsubscribe:${email.trim().toLowerCase()}:${list}`)
    .digest("hex");
}

export function verifyUnsubscribe(email: string, list: UnsubList, sig: string): boolean {
  const expected = Buffer.from(sign(email, list));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function unsubscribeUrl(email: string, list: UnsubList): string {
  const e = email.trim().toLowerCase();
  return `${SITE_URL}/api/email/unsubscribe?email=${encodeURIComponent(e)}&list=${list}&sig=${sign(e, list)}`;
}

/** RFC 8058 one-click headers for a scheduled letter. */
export function unsubscribeHeaders(email: string, list: UnsubList): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl(email, list)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/** Fills the footer's <!--unsub--> slot with a visible unsubscribe link. */
export function withUnsubscribeLink(html: string, url: string): string {
  return html.replace(
    "<!--unsub-->",
    `<p style="margin:10px 0 0;font-family:${emailStyles.SANS};font-size:11px;line-height:1.8;"><a href="${url}" style="color:#555;text-decoration:underline;">Unsubscribe from these letters</a></p>`
  );
}
