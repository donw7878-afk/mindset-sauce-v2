"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FlashWord from "@/components/FlashWord";
import {
  INSTITUTION_LINES,
  INSTITUTION_QUESTION_PREFIX,
  INSTITUTION_ANSWER,
  INSTITUTION_QUOTE,
  INSTITUTION_CLOSING,
} from "@/lib/content";
import styles from "./Institution.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * S3 — The Institution.
 * The reframe: not a course, an institution. Parallel proof-statements
 * land one at a time, then an interactive question whose subject flashes
 * while the answer stays fixed, a grandfather's line, and the turn.
 */
export default function Institution() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(`.${styles.head} > *`, {
        opacity: 0,
        y: 40,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
        },
      });

      // Each line lands in sequence — the same drumbeat as before
      gsap.from(`.${styles.litanyLine}`, {
        opacity: 0,
        y: 24,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.25,
        scrollTrigger: {
          trigger: `.${styles.litany}`,
          start: "top 78%",
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.institution} aria-label="The Institution">
      <div className="container">
        <div className={styles.head}>
          <p className="overline">The Institution</p>
          <h2>
            This is not a course.
            <br />
            It is an <span className="goldWord">institution</span>.
          </h2>
        </div>

        <div className={styles.litany}>
          {INSTITUTION_LINES.map((line, i) => (
            <p key={i} className={`${styles.litanyLine} ${styles.statement}`}>
              {line}
            </p>
          ))}

          <div className={`${styles.litanyLine} ${styles.question}`}>
            <span className={styles.qLine}>{INSTITUTION_QUESTION_PREFIX}</span>
            <span className={styles.qFlash}>
              <FlashWord />?
            </span>
            <span className={`${styles.qLine} ${styles.answer}`}>{INSTITUTION_ANSWER}</span>
          </div>

          <p className={`${styles.litanyLine} ${styles.quote}`}>{INSTITUTION_QUOTE}</p>

          <p className={`${styles.litanyLine} ${styles.closing}`}>{INSTITUTION_CLOSING}</p>
        </div>
      </div>
    </section>
  );
}
