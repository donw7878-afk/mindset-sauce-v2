import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { sessionVaultState } from "@/lib/vault-session";
import { TRACKS } from "@/lib/tracks";
import { MODULES } from "@/lib/content";
import TrackList from "./TrackList";
import shell from "../Vault.module.css";
import styles from "./AudioVault.module.css";

export const metadata: Metadata = {
  title: "The Audio Vault — The Mindset Sauce Institute™",
  robots: { index: false },
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI"];

export default async function AudioVaultPage() {
  const state = await sessionVaultState();
  if (!state) redirect("/login");

  const groups = MODULES.map((mod) => {
    const modState = state.modules[mod.n - 1];
    return {
      n: mod.n,
      roman: ROMAN[mod.n],
      title: mod.title,
      unlocked: modState.unlocked,
      complete: modState.complete,
      tracks: TRACKS.filter((t) => t.module === mod.n).map((t) => ({
        id: t.id,
        module: t.module,
        chapter: t.chapter,
        movement: t.movement,
        title: t.title,
        moduleTitle: t.moduleTitle,
        meta: t.meta,
        done: state.completed.has(t.id),
        playable:
          modState.unlocked &&
          (state.completed.has(t.id) ||
            (state.nextChapter?.module === t.module &&
              state.nextChapter?.chapter >= t.chapter)),
      })),
    };
  });

  return (
    <main className={shell.page}>
      <header className={shell.pageHead}>
        <p className="overline">The Audio Vault</p>
        <h1 className={shell.pageTitle}>
          Twenty-four sessions. <span className="goldWord">One combination.</span>
        </h1>
        <p className={shell.lede}>
          Four movements for every chamber, recorded so the Institute travels
          with you. Every player remembers exactly where you stopped — on any
          device.
        </p>
      </header>
      <div className={styles.groups}>
        <TrackList groups={groups} />
      </div>
    </main>
  );
}
