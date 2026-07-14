"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Stats.module.css";

/** Counter that rolls between values — 0.8s, no bounce (spec §10). */
function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) {
      setDisplay(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display.toLocaleString("en-US")}</>;
}

export function ScoreCard({ score }: { score: number }) {
  const [pulse, setPulse] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 1200);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className={`${styles.card} ${pulse ? styles.pulse : ""}`}>
      <p className={styles.label}>Builder Score</p>
      <p className={styles.scoreValue}>
        <AnimatedNumber value={score} />
      </p>
      <p className={styles.hint}>Chapters, chambers, and kept days — all of it counts.</p>
    </div>
  );
}

function Flame() {
  return (
    <svg
      className={styles.flame}
      width="22"
      height="28"
      viewBox="0 0 22 28"
      aria-label="Streak flame"
    >
      <path
        d="M11 1 C12 7 17 9 17 15 A6 6 0 0 1 5 15 C5 11 8 9.5 8 6 C9.5 7.5 10.5 9 10.5 11 C12.5 9 11.5 4 11 1 Z"
        fill="url(#flameGrad)"
      />
      <defs>
        <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8d5a0" />
          <stop offset="55%" stopColor="#daa520" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function StreakCard({
  streak,
  activeToday,
}: {
  streak: number;
  activeToday: boolean;
}) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>Builder Streak</p>
      <p className={styles.streakValue}>
        <AnimatedNumber value={streak} />
        <span className={styles.streakUnit}>{streak === 1 ? "day" : "days"}</span>
        {streak >= 7 && <Flame />}
      </p>
      <p className={styles.hint}>
        {activeToday
          ? "Today is already marked. The line holds."
          : streak > 0
            ? "Mark today before midnight — the streak is watching."
            : "Seal a chapter or run today's Executable to start the line."}
      </p>
    </div>
  );
}
