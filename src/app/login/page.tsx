import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "The Door — The Mindset Sauce Institute™",
  description: "Builders enter here.",
  robots: { index: false },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.builder?.id) redirect("/vault");
  return <LoginForm />;
}
