import { SITE_URL } from "./resend";
import {
  vaultEmail,
  overline,
  heading,
  p,
  goldLine,
  ledger,
  ledgerRow,
  cta,
  firstNameOf,
} from "./template";

/**
 * Sent from vault@ by the Stripe webhook the moment payment succeeds.
 * The ceremony email: access granted, what was unlocked, where to begin.
 */
export function accessEmail(opts: {
  name: string;
  builderNumber?: string;
  amountPaid: number; // cents
  receiptUrl?: string;
}): { subject: string; html: string } {
  const first = firstNameOf(opts.name || "Builder");
  const paid = `$${(opts.amountPaid / 100).toLocaleString("en-US")}`;

  const body = [
    overline("Access Granted"),
    heading(`Welcome, ${first}. The vault has opened.`),
    p(
      `What you unlocked today doesn't work because you bought it. It works because you will.`
    ),
    ledger(
      [
        opts.builderNumber ? ledgerRow("Builder No.", opts.builderNumber, true) : "",
        ledgerRow("Enrollment", "The Mindset Sauce Institute&trade; — Builder Access"),
        ledgerRow("Tuition received", paid),
        ledgerRow("Guarantee", "45-Day Builder Guarantee"),
      ].join("")
    ),
    p(
      `Everything is inside: all six chambers, the Owner's Manual, the Workbook, the Audio Vault, the Executables, the Transformation Tracker, and every bonus in the inventory.`
    ),
    goldLine(`Start here first: the Owner's Manual. Ten minutes. How to run the system — and yourself — for life.`),
    cta("Enter the Builder Dashboard", `${SITE_URL}/vault`),
    p(
      opts.receiptUrl
        ? `Your receipt is <a href="${opts.receiptUrl}" style="color:#daa520;">on file here</a>. Keep this email — it is your record of enrollment.`
        : `Keep this email — it is your record of enrollment.`
    ),
  ].join("");

  return {
    subject: `Access granted${opts.builderNumber ? ` — Builder ${opts.builderNumber}` : ""}. The vault has opened.`,
    html: vaultEmail({
      preheader: "Your enrollment is recorded. Start with the Owner's Manual.",
      body,
      footerNote:
        "The nurture letters have stopped — Builders inside the Institute don't receive invitations to a door they've already walked through.",
    }),
  };
}
