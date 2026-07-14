import { NextResponse, after } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { resend, FROM, REPLY_TO } from "@/lib/emails/resend";
import { accessEmail } from "@/lib/emails/access";
import { htmlToText } from "@/lib/emails/template";
import { cancelNurture } from "@/lib/emails/enroll";
import { enrollOnboarding } from "@/lib/emails/onboard";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Post-purchase entitlement. Stripe calls this on payment events; the
 * signature check is the only authentication, so STRIPE_WEBHOOK_SECRET
 * must be set (locally: `stripe listen --forward-to
 * localhost:3000/api/stripe/webhook`).
 *
 * On payment_intent.succeeded:
 *   1. Record the entitlement — a Supabase `builders` upsert (this is
 *      what The Door and the Builder Portal read), with the ndjson
 *      append kept as a local fallback record.
 *   2. Cancel the Builder's remaining nurture letters.
 *   3. Send the Access Granted ceremony email from vault@.
 *   4. Schedule the 7-letter Builder Path onboarding drip (days 0–21,
 *      via after() so Stripe gets its 200 without waiting on Resend).
 *
 * Idempotent by Stripe event id (stripe_events table) and PaymentIntent
 * id (in-memory) — Stripe retries deliveries.
 */

const seen = new Set<string>();

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set — rejecting.");
    return NextResponse.json({ error: "webhook not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", secret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  if (seen.has(intent.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  seen.add(intent.id);

  // Durable dedupe — survives restarts and multiple instances.
  if (supabaseConfigured) {
    try {
      const { error } = await supabaseAdmin()
        .from("stripe_events")
        .insert({ id: event.id });
      if (error?.code === "23505") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      if (error) console.error("[webhook] event dedupe write failed:", error);
    } catch (err) {
      console.error("[webhook] event dedupe threw:", err);
    }
  }

  const email = (intent.receipt_email ?? intent.metadata.email ?? "").toLowerCase();
  const name = intent.metadata.name || "Builder";
  const builderNumber = intent.metadata.builder_number || undefined;

  // 1. Entitlement on record — this is what the Builder Portal reads.
  if (supabaseConfigured && email) {
    try {
      const { error } = await supabaseAdmin()
        .from("builders")
        .upsert(
          {
            email,
            name,
            builder_number: builderNumber ?? null,
            payment_intent: intent.id,
            product: intent.metadata.product ?? null,
            amount_paid: intent.amount_received,
            coupon: intent.metadata.coupon || null,
            livemode: intent.livemode,
            purchased_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        );
      if (error) console.error("[webhook] builders upsert failed:", error);
    } catch (err) {
      console.error("[webhook] builders upsert threw:", err);
    }
  }

  const entitlement = {
    email,
    name,
    builderNumber,
    product: intent.metadata.product,
    amountPaid: intent.amount_received,
    coupon: intent.metadata.coupon || null,
    paymentIntent: intent.id,
    livemode: intent.livemode,
    purchasedAt: new Date().toISOString(),
  };
  try {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "entitlements.ndjson"),
      JSON.stringify(entitlement) + "\n",
      "utf8"
    );
  } catch (err) {
    // Never lose a purchase silently — the log line is the fallback record.
    console.error("[webhook] entitlement write failed:", err);
    console.log("[webhook] entitlement:", JSON.stringify(entitlement));
  }

  // 2. Builders inside the vault stop receiving invitations to it.
  let lettersCancelled = 0;
  if (email) {
    try {
      lettersCancelled = await cancelNurture(email);
    } catch (err) {
      console.error("[webhook] nurture cancel failed:", err);
    }
  }

  // 3. The ceremony email.
  if (email) {
    try {
      let receiptUrl: string | undefined;
      if (typeof intent.latest_charge === "string") {
        const charge = await stripe.charges.retrieve(intent.latest_charge);
        receiptUrl = charge.receipt_url ?? undefined;
      }
      const { subject, html } = accessEmail({
        name,
        builderNumber,
        amountPaid: intent.amount_received,
        receiptUrl,
      });
      const { error } = await resend.emails.send({
        from: FROM.vault,
        replyTo: REPLY_TO,
        to: [email],
        subject,
        html,
        text: htmlToText(html),
      });
      if (error) console.error("[webhook] access email failed:", error);
    } catch (err) {
      console.error("[webhook] access email threw:", err);
    }
  }

  // 4. The Builder Path — seven onboarding letters over 21 days.
  if (email) {
    after(() => enrollOnboarding({ email, name, builderNumber }));
  }

  return NextResponse.json({ received: true, lettersCancelled });
}
