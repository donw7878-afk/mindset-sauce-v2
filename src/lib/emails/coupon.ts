import { SITE_URL } from "./resend";
import {
  vaultEmail,
  overline,
  heading,
  p,
  goldLine,
  ledger,
  ledgerRow,
  codeSeal,
  cta,
  firstNameOf,
} from "./template";

export type LeadRecord = {
  name: string;
  email: string;
  score: number;
  archetype?: string;
  obstacle?: string;
  builderNumber?: string;
};

export function checkoutUrl(lead: Pick<LeadRecord, "email">): string {
  return `${SITE_URL}/checkout?code=BUILDER97&email=${encodeURIComponent(lead.email)}`;
}

/**
 * Sent from vault@ the moment the Builder Assessment is completed.
 * The Builder Report, read back — identity first, tuition second —
 * with the BUILDER97 invitation code sealed inside.
 */
export function couponEmail(lead: LeadRecord): { subject: string; html: string } {
  const first = firstNameOf(lead.name);
  const url = checkoutUrl(lead);

  const body = [
    overline("Your Builder Report — On Record"),
    heading(`${first}, the vault has your measurements.`),
    p(
      `Seven questions. One honest mirror. Here is what the Institute recorded:`
    ),
    ledger(
      [
        lead.archetype ? ledgerRow("Builder Archetype&trade;", lead.archetype, true) : "",
        ledgerRow("Builder Readiness&trade;", `${lead.score} / 100`),
        lead.obstacle ? ledgerRow("Primary Obstacle&trade;", lead.obstacle) : "",
        lead.builderNumber ? ledgerRow("Builder No.", lead.builderNumber) : "",
      ].join("")
    ),
    p(
      `Your Builder Number&trade; is your permanent Institute identity. It was assigned when you finished the assessment, and it does not expire.`
    ),
    goldLine(
      `You are not buying information. You are exchanging one identity for another.`
    ),
    p(
      `Your Private Builder Tuition&trade; has been unlocked: <strong style="color:#daa520;">$97</strong> instead of the public tuition of $397. Enter the code below at the Exchange, or use the button — it carries the code for you.`
    ),
    codeSeal("BUILDER97"),
    cta("Enter the Institute", url),
    p(
      `Every enrollment is protected by the 45-Day Builder Guarantee: complete the work, and if you genuinely believe the Institute wasn't worth your investment, one email returns every dollar. No questions asked.`
    ),
  ].join("");

  return {
    subject: `Your Builder Report is ready, ${first} — ${lead.builderNumber ?? "on record"}`,
    html: vaultEmail({
      preheader: `${lead.archetype ?? "Your Builder Archetype"} · Readiness ${lead.score}/100 · Private Builder Tuition™ unlocked`,
      body,
      footerNote:
        "Your Builder Report, your invitation, and letters worth keeping — that was the promise. This is the first of them.",
    }),
  };
}
