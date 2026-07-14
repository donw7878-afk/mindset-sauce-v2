import { NextResponse } from "next/server";
import { ONBOARDING_SEQUENCE } from "@/lib/emails/onboarding";

/**
 * Dev-only: render any Builder Path letter in the browser.
 *   /api/dev/onboarding-preview?n=1 … 7
 * Disabled in production.
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const n = Number(new URL(req.url).searchParams.get("n") ?? "1");
  const letter = ONBOARDING_SEQUENCE[n - 1];
  if (!letter) {
    return NextResponse.json({ error: "n must be 1–7" }, { status: 404 });
  }
  const builder = {
    email: "preview@example.com",
    name: "Don Preview",
    builderNumber: "#004521",
  };
  return new Response(letter.html(builder), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Subject": encodeURIComponent(letter.subject(builder)),
      "X-From": letter.from,
      "X-Day": String(letter.day),
    },
  });
}
