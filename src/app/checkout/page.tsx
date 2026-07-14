import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "The Exchange — The Mindset Sauce Institute™",
  description: "One identity for another.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutClient />
    </Suspense>
  );
}
