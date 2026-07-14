"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer, formatTime } from "@/components/vault/AudioProvider";
import Ring from "@/components/vault/Ring";
import styles from "./Chamber.module.css";

/**
 * The ritual path — four chapters in fixed order. Play feeds the shared
 * engine; completion is enforced server-side; sealing the fourth chapter
 * plays the chamber-seal ceremony.
 */

interface ChapterRow {
  chapter: number;
  movement: string;
  title: string;
  desc: string;
  meta: string;
  done: boolean;
  isNext: boolean;
  locked: boolean;
}

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI"];

export default function ChapterPath({
  module,
  moduleTitle,
  chapters,
  workbookAvailable,
  nextModule,
}: {
  module: number;
  moduleTitle: string;
  chapters: ChapterRow[];
  workbookAvailable: boolean;
  nextModule: number | null;
}) {
  const router = useRouter();
  const player = usePlayer();
  const [busy, setBusy] = useState<number | null>(null);
  const [seal, setSeal] = useState<null | { certificate: boolean }>(null);

  function playable(ch: ChapterRow) {
    return {
      id: `m${module}c${ch.chapter}`,
      module,
      chapter: ch.chapter,
      movement: ch.movement,
      title: ch.title,
      moduleTitle,
      meta: ch.meta,
    };
  }

  async function markComplete(ch: ChapterRow) {
    setBusy(ch.chapter);
    try {
      const res = await fetch("/api/vault/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, chapter: ch.chapter }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        moduleSealed?: boolean;
        certificateUnlocked?: boolean;
      };
      if (data.ok && data.moduleSealed) {
        setSeal({ certificate: Boolean(data.certificateUnlocked) });
        setTimeout(() => router.refresh(), 3000);
      } else if (data.ok) {
        router.refresh();
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <ol className={styles.path}>
        {chapters.map((ch) => {
          const trackId = `m${module}c${ch.chapter}`;
          const isCurrent = player.track?.id === trackId;
          const playing = isCurrent && player.playing;
          const saved = isCurrent
            ? player.position
            : player.positions[trackId] ?? 0;
          const isPractice = ch.chapter === 3;

          return (
            <li
              key={ch.chapter}
              className={[
                styles.step,
                ch.done ? styles.stepDone : "",
                ch.isNext ? styles.stepActive : "",
                ch.locked ? styles.stepLocked : "",
              ].join(" ")}
            >
              <span className={styles.stepRing}>
                <Ring
                  state={ch.done ? "done" : ch.isNext ? "active" : "open"}
                  size={22}
                  title={ch.done ? "Sealed" : ch.isNext ? "Current" : "Ahead"}
                />
              </span>

              <div className={styles.stepBody}>
                <p className={styles.stepMovement}>{ch.movement}</p>
                <h2 className={styles.stepTitle}>{ch.title}</h2>
                <p className={styles.stepDesc}>{ch.desc}</p>
                <p className={styles.stepMeta}>{ch.meta}</p>

                {!ch.locked && (
                  <div className={styles.stepActions}>
                    <button
                      className={styles.playAction}
                      onClick={() => player.play(playable(ch))}
                    >
                      <span className={styles.playGlyph} aria-hidden>
                        {playing ? "❚❚" : "▶"}
                      </span>
                      {playing
                        ? "Pause"
                        : saved > 1
                          ? `Resume at ${formatTime(saved)}`
                          : "Begin the audio"}
                    </button>

                    {isPractice &&
                      (workbookAvailable ? (
                        <a
                          className={styles.workbookLink}
                          href="/api/media/pdf/workbook"
                          target="_blank"
                          rel="noopener"
                        >
                          Open the Workbook &rarr;
                        </a>
                      ) : (
                        <a
                          className={styles.workbookLink}
                          href="/api/media/pdf/tracker"
                          target="_blank"
                          rel="noopener"
                        >
                          Open the Tracker &rarr;
                        </a>
                      ))}

                    {ch.isNext && (
                      <button
                        className={styles.completeBtn}
                        onClick={() => markComplete(ch)}
                        disabled={busy === ch.chapter}
                      >
                        {busy === ch.chapter
                          ? "Sealing…"
                          : isPractice
                            ? "Mark practice complete"
                            : ch.chapter === 4
                              ? "Complete the Close"
                              : "Mark chapter complete"}
                      </button>
                    )}
                    {ch.done && <span className={styles.sealedNote}>Sealed</span>}
                  </div>
                )}
                {ch.locked && (
                  <p className={styles.lockedNote}>
                    Opens when the chapter before it is sealed.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {seal && (
        <div className={styles.sealOverlay} role="status">
          <div className={styles.sealStamp}>
            <span className={styles.sealRing} aria-hidden />
            <p className="overline">Chamber {ROMAN[module]}</p>
            <h2 className={styles.sealTitle}>
              {seal.certificate ? "24 of 24. It is done." : "Chamber sealed."}
            </h2>
            <p className={styles.sealCopy}>
              {seal.certificate ? (
                <>
                  Every chamber is sealed and the Certificate has unlocked —{" "}
                  <Link href="/vault/certificate" className={styles.sealLink}>
                    generate it now
                  </Link>
                  .
                </>
              ) : nextModule ? (
                <>Chamber {ROMAN[nextModule]} has unlocked. The combination turns in sequence.</>
              ) : (
                <>The final chamber is yours.</>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
