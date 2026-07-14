"use client";

import { usePlayer, formatTime, type PlayableTrack } from "@/components/vault/AudioProvider";
import Ring from "@/components/vault/Ring";
import styles from "./AudioVault.module.css";

interface Row extends PlayableTrack {
  done: boolean;
  playable: boolean;
}

interface Group {
  n: number;
  roman: string;
  title: string;
  unlocked: boolean;
  complete: boolean;
  tracks: Row[];
}

export default function TrackList({ groups }: { groups: Group[] }) {
  const player = usePlayer();

  return (
    <>
      {groups.map((g) => (
        <section
          key={g.n}
          className={`${styles.group} ${g.unlocked ? "" : styles.groupLocked}`}
          aria-label={`Module ${g.n} — ${g.title}`}
        >
          <div className={styles.groupHead}>
            <h2 className={styles.groupTitle}>
              <span className={styles.groupNo}>{g.roman}.</span> {g.title}
            </h2>
            <span className={styles.groupState}>
              {g.complete ? "Sealed" : g.unlocked ? "Open" : "Locked"}
            </span>
          </div>

          <ul className={styles.rows}>
            {g.tracks.map((t) => {
              const isCurrent = player.track?.id === t.id;
              const playing = isCurrent && player.playing;
              const saved = isCurrent ? player.position : player.positions[t.id] ?? 0;
              return (
                <li key={t.id} className={styles.row}>
                  <span className={styles.rowRing}>
                    <Ring
                      state={t.done ? "done" : t.playable ? "active" : "open"}
                      size={18}
                      title={t.done ? "Sealed" : t.playable ? "Available" : "Locked"}
                    />
                  </span>
                  <div className={styles.rowText}>
                    <p className={styles.rowMovement}>{t.movement}</p>
                    <p className={styles.rowTitle}>{t.title}</p>
                  </div>
                  <span className={styles.rowMeta}>
                    {saved > 1 && !playing ? `resume ${formatTime(saved)}` : t.meta}
                  </span>
                  {t.playable ? (
                    <button
                      className={`${styles.rowPlay} ${playing ? styles.rowPlaying : ""}`}
                      aria-label={playing ? `Pause ${t.title}` : `Play ${t.title}`}
                      onClick={() => player.play(t)}
                    >
                      {playing ? "❚❚" : "▶"}
                    </button>
                  ) : (
                    <span className={styles.rowLock} aria-label="Locked">
                      <svg width="12" height="14" viewBox="0 0 14 16" aria-hidden>
                        <rect x="1" y="7" width="12" height="8" rx="1.5" fill="none" stroke="currentColor" />
                        <path d="M4 7 V5 a3 3 0 0 1 6 0 V7" fill="none" stroke="currentColor" />
                      </svg>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
