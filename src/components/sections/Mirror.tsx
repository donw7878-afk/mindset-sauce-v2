"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Beat } from "@/lib/content";
import styles from "./Mirror.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * S2 — The Mirror (and the pre-module Interlude).
 * Typography only. Each beat is one internal realization surfacing
 * slowly; the previous beat recedes into the dark as the next arrives.
 */
export default function Mirror({
  beats,
  ariaLabel = "The Mirror",
  compact = false,
}: {
  beats: Beat[];
  ariaLabel?: string;
  compact?: boolean;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const beatEls = gsap.utils.toArray<HTMLElement>(`.${styles.beat}`);
      beatEls.forEach((beat, i) => {
        // Lines within a beat surface one after another — slow, elegant
        gsap.from(beat.querySelectorAll(`.${styles.beatLine}`), {
          opacity: 0,
          y: 40,
          duration: 1.5,
          ease: "expo.out",
          stagger: 0.35,
          scrollTrigger: {
            trigger: beat,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });
        // Previous realization recedes as the next arrives
        if (i > 0) {
          gsap.to(beatEls[i - 1], {
            opacity: 0.3,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: beat,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className={`${styles.mirror} ${compact ? styles.compact : ""}`}
      aria-label={ariaLabel}
    >
      <div className={styles.stack}>
        {beats.map((beat, i) => (
          <p key={i} className={styles.beat}>
            {beat.map((line, j) => (
              <span key={j} className={styles.beatLine}>
                {line.map((seg, k) =>
                  seg.gold ? (
                    <span key={k} className="goldWord">
                      {seg.t}
                    </span>
                  ) : (
                    <span key={k}>{seg.t}</span>
                  )
                )}
              </span>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
