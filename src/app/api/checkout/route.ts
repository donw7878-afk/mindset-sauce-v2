import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, PRICE_ID, PRODUCT_NAME } from "@/lib/stripe";

/**
 * The Exchange, server side. Two actions:
 *
 *  { action: "quote", code? }
 *    → authoritative pricing: list tuition from the Stripe price,
 *      discount from the live promotion code (never trusted client math).
 *
 *  { action: "intent", email, name?, builderNumber?, code? }
 *    → creates the PaymentIntent at the quoted amount; the client
 *      confirms it with the Payment Element. Entitlement is granted by
 *      the webhook on payment_intent.succeeded, never by the client.
 */

type CheckoutBody = {
  action?: "quote" | "intent";
  email?: string;
  name?: string;
  builderNumber?: string;
  code?: string;
};

async function quote(code?: string) {
  const price = await stripe.prices.retrieve(PRICE_ID);
  const listAmount = price.unit_amount ?? 39700;
  if (!code?.trim()) {
    return { listAmount, discount: 0, amount: listAmount, code: null, currency: price.currency };
  }

  // ANY active Stripe promotion code is honored here — BUILDER97 is just
  // the house code. New codes need only exist (and be active) in the
  // Stripe dashboard; there is no assessment gate on this field.
  const promos = await stripe.promotionCodes.list({
    code: code.trim().toUpperCase(),
    active: true,
    limit: 1,
  });
  const promo = promos.data[0];
  // The coupon's location depends on the account's API version: classic
  // promo.coupon vs the renamed promo.promotion.coupon. Read both.
  const promoShape = promo as
    | (typeof promo & { coupon?: string | Stripe.Coupon })
    | undefined;
  const rawCoupon = promoShape?.promotion?.coupon ?? promoShape?.coupon;
  const coupon =
    typeof rawCoupon === "string" ? await stripe.coupons.retrieve(rawCoupon) : rawCoupon;
  if (!coupon?.valid) {
    return { listAmount, discount: 0, amount: listAmount, code: null, currency: price.currency, invalidCode: true };
  }

  const discount = coupon.amount_off
    ?? Math.round((listAmount * (coupon.percent_off ?? 0)) / 100);
  // Stripe's minimum charge is 50¢ — a full-discount code still needs a PI.
  const amount = Math.max(listAmount - discount, 50);
  return { listAmount, discount: listAmount - amount, amount, code: promo.code, currency: price.currency };
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  try {
    const q = await quote(body.code);

    if (body.action === "quote") {
      return NextResponse.json(q);
    }

    const email = body.email?.trim().toLowerCase() ?? "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required — it is where your access arrives." }, { status: 400 });
    }

    const intent = await stripe.paymentIntents.create({
      amount: q.amount,
      currency: q.currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: PRODUCT_NAME,
      metadata: {
        product: PRODUCT_NAME,
        price_id: PRICE_ID,
        email,
        name: body.name?.trim().slice(0, 120) ?? "",
        builder_number: body.builderNumber?.trim().slice(0, 12) ?? "",
        coupon: q.code ?? "",
        list_amount: String(q.listAmount),
        discount: String(q.discount),
      },
    });

    return NextResponse.json({ clientSecret: intent.client_secret, ...q });
  } catch (err) {
    console.error("[checkout] stripe error:", err);
    return NextResponse.json(
      { error: "The Exchange is momentarily unavailable. Nothing was charged." },
      { status: 500 }
    );
  }
}
