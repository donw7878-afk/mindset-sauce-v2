import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import Ceremony from "./Ceremony";

export const metadata: Metadata = {
  title: "Access Granted — The Mindset Sauce Institute™",
  description: "The vault recognizes you.",
  robots: { index: false },
};

/**
 * The ceremony is earned. Stripe returns here after payment with
 * ?payment_intent=…; we verify it server-side before the vault opens.
 * Anyone arriving without a verified payment is returned to the Exchange.
 * (Dev only: /welcome?preview=1 plays the ceremony without a payment.)
 */
export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string; preview?: string }>;
}) {
  const { payment_intent, preview } = await searchParams;

  if (preview === "1" && process.env.NODE_ENV !== "production") {
    return <Ceremony />;
  }

  if (!payment_intent) redirect("/#exchange");

  let name: string | undefined;
  let builderNumber: string | undefined;
  let paid = false;
  try {
    const intent = await stripe.paymentIntents.retrieve(payment_intent);
    // "processing" (e.g. some bank methods) still deserves the ceremony —
    // entitlement email follows from the webhook when it settles.
    paid = intent.status === "succeeded" || intent.status === "processing";
    name = intent.metadata.name || undefined;
    builderNumber = intent.metadata.builder_number || undefined;
  } catch {
    paid = false;
  }

  if (!paid) redirect("/checkout");

  return <Ceremony builderName={name} builderNumber={builderNumber} />;
}
