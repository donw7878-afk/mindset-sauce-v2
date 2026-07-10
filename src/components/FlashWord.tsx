"use client";

import { useEffect, useState } from "react";
import { FLASH_WORDS } from "@/lib/content";
import styles from "./FlashWord.module.css";

/**
 * The cycling word inside The Institution's question. Each word holds for
 * its own beat (< 1s, but Purpose and Time linger at 1.5s), rendered in
 * Cormorant Garamond italic gold while the sentence around it stays Outfit.
 * Reduced-motion visitors get a single static word — no flashing.
 */
export default function FlashWord() {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    let idx = 0;
    const tick = () => {
      idx = (idx + 1) % FLASH_WORDS.length;
      setI(idx);
      timer = setTimeout(tick, FLASH_WORDS[idx].ms);
    };
    timer = setTimeout(tick, FLASH_WORDS[0].ms);
    return () => clearTimeout(timer);
  }, []);

  // A stable word for reduced-motion; otherwise the current beat.
  const word = reduced ? "Purpose" : FLASH_WORDS[i].word;

  return (
    <span className={styles.flash} aria-hidden>
      {/* key remount replays the quick fade for each new word */}
      <span key={word} className={styles.word}>
        {word}
      </span>
    </span>
  );
}
