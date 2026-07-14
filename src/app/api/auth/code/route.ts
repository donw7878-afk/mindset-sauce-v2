import { NextResponse } from "next/server";
import { issueLoginCode } from "@/lib/login-codes";
import { resend, FROM, REPLY_TO } from "@/lib/emails/resend";
import { combinationEmail } from "@/lib/emails/login";
import { htmlToText } from "@/lib/emails/template";
import { getBuilderByEmail } from "@/lib/vault";

export const runtime = "nodejs";

/**
 * Step one at The Door: a Builder asks for their combination.
 * Only addresses on the builders ledger get one; everyone else is
 * pointed to the Exchange.
 */
export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: string };
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    /* fall through to validation */
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  try {
    const issued = await issueLoginCode(email);
    if (!issued.ok) {
      return NextResponse.json({ ok: false, reason: issued.reason });
    }

    const builder = await getBuilderByEmail(email);
    const { subject, html } = combinationEmail({
      name: builder?.name ?? "Builder",
      code: issued.code,
    });
    const { error } = await resend.emails.send({
      from: FROM.vault,
      replyTo: REPLY_TO,
      to: [email],
      subject,
      html,
      text: htmlToText(html),
    });
    if (error) {
      console.error("[auth] combination email failed:", error);
      return NextResponse.json({ ok: false, reason: "send-failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[auth] code issue threw:", err);
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }
}
