import { redirect } from "next/navigation";
import { sessionVaultState } from "@/lib/vault-session";

/** /vault/modules always means "take me to my current chamber". */
export default async function ModulesIndex() {
  const state = await sessionVaultState();
  if (!state) redirect("/login");
  redirect(`/vault/modules/${state.currentModule}`);
}
