import type { Metadata } from "next";
import Ceremony from "./Ceremony";

export const metadata: Metadata = {
  title: "Access Granted — The Mindset Sauce Institute™",
  description: "The vault recognizes you.",
  robots: { index: false },
};

export default function WelcomePage() {
  return <Ceremony />;
}
