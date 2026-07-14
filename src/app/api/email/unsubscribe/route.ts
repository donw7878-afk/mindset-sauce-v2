import { NextResponse } from "next/server";
import { verifyUnsubscribe, type UnsubList } from "@/lib/emails/unsubscribe";
import { cancelNurture } from "@/lib/emails/enroll";
import { cancelOnboarding } from "@/lib/emails/onboard";

export const runtime = "nodejs";

/**
 * One-click unsubscribe (RFC 8058). Gmail/Yahoo POST here from the
 * List-Unsubscribe header; humans land here from the footer link (GET).
 * Both cancel every still-scheduled letter in the sequence at Resend.
 */

async function unsubscribe(req: Request): Promise<{ ok: boolean; status: number }> {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  const list = url.searchParams.get("list") as UnsubList | null;
  const sig = url.searchParams.get("sig") ?? "";

  if (!email || (list !== "nurture" && list !== "onboarding")) {
    return { ok: false, status: 400 };
  }
  if (!verifyUnsubscribe(email, list, sig)) {
    return { ok: false, status: 403 };
  }

  try {
    if (list === "nurture") await cancelNurture(email);
    else await cancelOnboarding(email);
  } catch (err) {
    console.error("[unsubscribe] cancel failed:", err);
    // The click still counts — never bounce a one-click unsubscribe.
  }
  return { ok: true, status: 200 };
}

/** Mailbox providers' one-click POST — must succeed with no UI. */
export async function POST(req: Request) {
  const { ok, status } = await unsubscribe(req);
  return NextResponse.json({ ok }, { status });
}

/** A human clicking the footer link. */
export async function GET(req: Request) {
  const { ok, status } = await unsubscribe(req);
  const body = ok
    ? `<h1>You're unsubscribed.</h1><p>No more letters from this sequence will arrive. If you change your mind, the door is always open at themindsetsauce.com.</p>`
    : `<h1>That link didn't turn.</h1><p>This unsubscribe link is invalid or incomplete. Reply to any of our emails and we'll take care of it by hand.</p>`;
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Mindset Sauce Institute™</title></head>
<body style="margin:0;padding:60px 20px;background:#080808;font-family:Helvetica,Arial,sans-serif;color:#ede8dd;text-align:center;">
<div style="max-width:480px;margin:0 auto;border:1px solid #2a2a2a;background:#121212;padding:44px 32px;">
<p style="margin:0 0 20px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#daa520;">The Mindset Sauce Institute&trade;</p>
${body.replace("<h1>", '<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;color:#f5f0e8;">').replace("<p>", '<p style="margin:0;font-size:14px;font-weight:300;line-height:1.8;color:#8a8578;">')}
</div></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
