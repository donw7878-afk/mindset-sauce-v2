import { redirect } from "next/navigation";
import { sessionVaultState } from "@/lib/vault-session";
import AudioProvider from "@/components/vault/AudioProvider";
import AudioDock from "@/components/vault/AudioDock";
import VaultNav from "@/components/vault/VaultNav";
import styles from "./Vault.module.css";

/**
 * Life inside the vault. One session check, one audio engine — playback
 * and the dock survive navigation anywhere under /vault.
 */
export default async function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = await sessionVaultState();
  if (!state) redirect("/login");

  const positions = Object.fromEntries(
    Object.entries(state.positions).map(([id, p]) => [id, p.seconds])
  );

  return (
    <AudioProvider initialPositions={positions}>
      <VaultNav
        name={state.builder.name}
        builderNumber={state.builder.builder_number}
        score={state.score}
        currentModule={state.currentModule}
      />
      <div className={styles.shell}>{children}</div>
      <AudioDock />
    </AudioProvider>
  );
}
