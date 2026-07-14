"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { deepRelease, goldTone } from "@/lib/sound";
import styles from "./VaultWelcome.module.css";

/**
 * The final emotional moment. Fade to black:
 * "Welcome, / Builder #004826 / The vault has opened."
 * Phase Two: when `href` is given, the ceremony holds, then carries the
 * Builder into the Exchange (Stripe checkout); otherwise it hands the
 * visitor back via onDone.
 */
export default function VaultWelcome({
  builderNumber,
  onDone,
  href,
}: {
  builderNumber: string;
  onDone: () => void;
  href?: string;
}) {
  useEffect(() => {
    deepRelease(0.35);
    const tone = setTimeout(() => goldTone(0.08), 1200);
    const done = setTimeout(() => {
      if (href) window.location.assign(href);
      else onDone();
    }, 6000);
    return () => {
      clearTimeout(tone);
      clearTimeout(done);
    };
  }, [onDone, href]);

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      role="status"
    >
      <motion.p
        className={styles.welcome}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        Welcome,
      </motion.p>
      <motion.p
        className={styles.number}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        Builder {builderNumber}
      </motion.p>
      <motion.p
        className={styles.line}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.1, duration: 1.4 }}
      >
        The vault has opened.
      </motion.p>
      {href && (
        <motion.p
          className={styles.line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 4.6, duration: 1.2 }}
        >
          Preparing your Exchange&hellip;
        </motion.p>
      )}
      <motion.span
        className={styles.glow}
        aria-hidden
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.5, scale: 1.3 }}
        transition={{ delay: 2.8, duration: 2.6, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
