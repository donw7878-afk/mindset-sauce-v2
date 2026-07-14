"use client";

import { useEffect, useState } from "react";
import styles from "./Progress.module.css";

/**
 * Transformation Progress — 24 chapters across 6 modules. Bars animate
 * from zero on mount (1s, --ease-heavy, spec §10).
 */
export default function Progress({
  totalComplete,
  modules,
}: {
  totalComplete: number;
  modules: { n: number; title: string; done: number; unlocked: boolean }[];
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const overall = (totalComplete / 24) * 100;

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <p className={styles.label}>Transformation Progress</p>
        <p className={styles.count}>
          <span className={styles.countGold}>{totalComplete}</span> / 24 chapters
        </p>
      </div>

      <div className={styles.overallTrack}>
        <div
          className={styles.overallFill}
          style={{ width: armed ? `${overall}%` : "0%" }}
        />
      </div>

      <ul className={styles.moduleList}>
        {modules.map((m) => (
          <li key={m.n} className={`${styles.moduleRow} ${m.unlocked ? "" : styles.locked}`}>
            <span className={styles.moduleName}>
              <span className={styles.moduleNo}>{String(m.n).padStart(2, "0")}</span>
              {m.title}
            </span>
            <span className={styles.moduleTrack}>
              <span
                className={styles.moduleFill}
                style={{
                  width: armed ? `${(m.done / 4) * 100}%` : "0%",
                  transitionDelay: `${m.n * 100}ms`,
                }}
              />
            </span>
            <span className={styles.moduleCount}>{m.done}/4</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
