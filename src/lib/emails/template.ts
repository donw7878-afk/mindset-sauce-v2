/**
 * The vault, in an inbox. Email-safe rendering of the design system:
 * void black ground, onyx panel, gold ramp, serif display. Web fonts are
 * unreliable in email clients, so Cormorant Garamond degrades to Georgia
 * and Outfit degrades to Helvetica — same temperature, honest fallbacks.
 * Tables and inline styles throughout; no fake scarcity, ever.
 */

const GOLD = "#daa520";
const GOLD_GLOW = "#e8d5a0";
const VOID = "#080808";
const ONYX = "#121212";
const STEEL = "#2a2a2a";
const TEXT = "#ede8dd";
const HEADING = "#f5f0e8";
const MUTED = "#8a8578";

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

export const emailStyles = { GOLD, VOID, ONYX, TEXT, MUTED, SERIF, SANS };

/** One paragraph of body copy. */
export function p(html: string): string {
  return `<p style="margin:0 0 18px;font-family:${SANS};font-size:15px;font-weight:300;line-height:1.8;color:${TEXT};">${html}</p>`;
}

/** A gold serif pull-line — the email equivalent of a goldWord heading. */
export function goldLine(html: string): string {
  return `<p style="margin:28px 0;font-family:${SERIF};font-style:italic;font-size:19px;line-height:1.6;color:${GOLD};">${html}</p>`;
}

/** Small caps overline, e.g. "THE BUILDER LETTERS — Nº 04". */
export function overline(text: string): string {
  return `<p style="margin:0 0 14px;font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};">${text}</p>`;
}

/** Section heading in serif. */
export function heading(html: string): string {
  return `<h2 style="margin:0 0 20px;font-family:${SERIF};font-weight:600;font-size:26px;line-height:1.3;color:${HEADING};">${html}</h2>`;
}

/** The gold CTA button. */
export function cta(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:30px auto;"><tr><td style="background:${GOLD};border-radius:4px;">
    <a href="${href}" style="display:inline-block;padding:15px 34px;font-family:${SANS};font-size:13px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:${VOID};text-decoration:none;">${label}</a>
  </td></tr></table>`;
}

/** A framed detail row block (ledger-style). */
export function ledgerRow(label: string, value: string, gold = false): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${STEEL};font-family:${SANS};font-size:13px;font-weight:300;color:${gold ? GOLD : TEXT};">${label}</td>
    <td align="right" style="padding:10px 0;border-bottom:1px solid ${STEEL};font-family:'Courier New',monospace;font-size:14px;color:${gold ? GOLD : TEXT};">${value}</td>
  </tr>`;
}

export function ledger(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">${rows}</table>`;
}

/** The invitation-code seal. */
export function codeSeal(code: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:26px 0;"><tr><td align="center" style="border:1px solid ${GOLD};padding:22px;">
    <p style="margin:0 0 6px;font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${MUTED};">Builder Invitation Code</p>
    <p style="margin:0;font-family:'Courier New',monospace;font-size:24px;letter-spacing:6px;color:${GOLD};">${code}</p>
  </td></tr></table>`;
}

/** A personal sign-off for Don's letters. */
export function signoff(name = "Don", title?: string): string {
  return `<p style="margin:30px 0 0;font-family:${SERIF};font-style:italic;font-size:18px;color:${GOLD_GLOW};">— ${name}</p>${
    title
      ? `<p style="margin:4px 0 0;font-family:${SANS};font-size:12px;color:${MUTED};">${title}</p>`
      : ""
  }`;
}

/**
 * Full email shell. `preheader` is the hidden inbox preview line.
 */
export function vaultEmail(opts: {
  preheader: string;
  body: string;
  footerNote?: string;
  /** The compliance line under the footer — why this email arrived. */
  reason?: string;
}): string {
  const {
    preheader,
    body,
    footerNote,
    reason = "You are receiving this because you completed the Builder Assessment.",
  } = opts;
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin:0;padding:0;background:${VOID};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${VOID};">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td align="center" style="padding:0 0 28px;">
          <p style="margin:0;font-family:${SERIF};font-size:20px;letter-spacing:1px;color:${HEADING};">The Mindset Sauce Institute<span style="font-size:11px;vertical-align:top;">&trade;</span></p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px auto 0;"><tr><td style="width:56px;height:1px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td></tr></table>
        </td></tr>
        <tr><td style="background:${ONYX};border:1px solid ${STEEL};padding:44px 40px;">
          ${body}
        </td></tr>
        <tr><td align="center" style="padding:28px 20px 0;">
          ${footerNote ? `<p style="margin:0 0 12px;font-family:${SANS};font-size:12px;line-height:1.7;color:${MUTED};">${footerNote}</p>` : ""}
          <p style="margin:0;font-family:${SANS};font-size:11px;line-height:1.8;color:#555;">The Mindset Sauce Institute&trade; &middot; Build your mind. The results will follow.<br>${reason}</p>
          <p style="margin:10px 0 0;font-family:${SANS};font-size:11px;line-height:1.8;color:#555;">You're receiving this because you joined The Mindset Sauce Institute&trade;. Reply to this email anytime &mdash; Don reads every one.</p>
          <!--unsub-->
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** First name only — letters address a person, not a record. */
export function firstNameOf(name: string): string {
  return (name.trim().split(/\s+/)[0] ?? "Builder").replace(/[<>&"]/g, "");
}

const TEXT_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&mdash;": "—",
  "&ndash;": "–",
  "&middot;": "·",
  "&trade;": "™",
  "&rarr;": "→",
  "&hellip;": "…",
  "&zwnj;": "",
};

/**
 * Plain-text rendering of a vault email — the multipart/alternative body
 * every send carries alongside the HTML for deliverability. Links become
 * "label (url)", block elements become line breaks.
 */
export function htmlToText(html: string): string {
  let s = html
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // The hidden preheader never belongs in the text part.
    .replace(/<div style="display:none[\s\S]*?<\/div>/i, "");
  s = s.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
    const clean = label.replace(/<[^>]+>/g, "").trim();
    return clean ? `${clean} (${href})` : href;
  });
  s = s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h1|h2|h3|tr|table|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  s = s.replace(/&[a-z#0-9]+;/gi, (e) => TEXT_ENTITIES[e.toLowerCase()] ?? "");
  return s
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
