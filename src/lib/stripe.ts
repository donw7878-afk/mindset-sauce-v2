import Stripe from "stripe";

/**
 * Server-side Stripe client. Test mode until the live keys land.
 * Product: The Mindset Sauce Institute™ — Builder Access ($397),
 * coupon BUILDER97 (−$300 → $97) exposed as a promotion code.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  appInfo: { name: "The Mindset Sauce Institute", version: "1.0.0" },
});

export const PRICE_ID = process.env.STRIPE_PRICE_ID ?? "";

export const PRODUCT_NAME = "The Mindset Sauce Institute™ — Builder Access";
