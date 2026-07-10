"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BUILDERS } from "@/lib/content";
import styles from "./Builders.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * S7 — The Builders.
 * Proof as engraved plates, not chat bubbles. Editorial and restrained —
 * a human rhythm after the spectacle of the vault.
 */
export default function Builders() {
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
        scrollTrigger: { trigger: `.${styles.head}`, start: "top 80%" },
      });

      gsap.utils.toArray<HTMLElement>(`.${styles.plate}`).forEach((plate, i) => {
        gsap.from(plate, {
          opacity: 0,
          x: i % 2 === 0 ? -60 : 60,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: plate, start: "top 85%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="builders" className={styles.builders} aria-label="The Builders">
      <div className="container">
        <div className={styles.head}>
          <p className="overline">The Builders</p>
          <h2>
            They made the same decision <span className="goldWord">you&rsquo;re making now</span>.
          </h2>
        </div>

        <div className={styles.plates}>
          {BUILDERS.map((b, i) => (
            <blockquote key={i} className={styles.plate}>
              <p className={styles.quote}>&ldquo;{b.quote}&rdquo;</p>
              <footer>
                <span className={styles.name}>{b.name}</span>
                <span className={styles.detail}>{b.detail}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
