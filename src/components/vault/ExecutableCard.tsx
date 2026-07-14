"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ExecutableCard.module.css";

/** Today's Executable — open the page, then keep the promise. */
export default function ExecutableCard({ done }: { done: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [localDone, setLocalDone] = useState(done);

  async function markDone() {
    setBusy(true);
    try {
      const res = await fetch("/api/vault/checkin", { method: "POST" });
      if (res.ok) {
        setLocalDone(true);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`${styles.card} ${localDone ? styles.done : ""}`}>
      <p className={styles.label}>Today&rsquo;s Executable</p>
      <p className={styles.copy}>
        The day&rsquo;s non-negotiables, distilled to one page. Small enough to do
        today. Heavy enough to matter.
      </p>
      <div className={styles.actions}>
        <a
          className={styles.open}
          href="/api/media/pdf/executables"
          target="_blank"
          rel="noopener"
        >
          Open the Executables &rarr;
        </a>
        {localDone ? (
          <span className={styles.sealed}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <circle cx="7" cy="7" r="6.5" fill="var(--gold-primary)" />
              <path
                d="M4 7.2 L6.2 9.4 L10 5"
                stroke="#080808"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            Done today — a promise kept
          </span>
        ) : (
          <button className={styles.markBtn} onClick={markDone} disabled={busy}>
            {busy ? "Recording…" : "Mark it done"}
          </button>
        )}
      </div>
    </div>
  );
}
