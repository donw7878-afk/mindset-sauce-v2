"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Particles from "@/components/Particles";
import styles from "./Decision.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * S9 — The Decision.
 * The door again — ajar now, light spilling through. Two versions of
 * the visitor stand at this threshold; only one walks through.
 */
export default function Decision() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(`.${styles.copy} > *`, {
        opacity: 0,
        y: 40,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      // The light widens with dwell time once the section is on screen
      gsap.to(`.${styles.shaft}`, {
        scaleX: 2.2,
        opacity: 0.85,
        duration: 14,
        ease: "sine.out",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });

      // CTA breathes: 1.5% scale, 4s cycle
      gsap.to(`.${styles.cta}`, {
        scale: 1.015,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="decision" className={styles.decision} aria-label="The Decision">
      <div className={styles.scene} aria-hidden>
        <img
          src="/images/vault-interior.png"
          alt=""
          className={styles.interior}
          loading="lazy"
          decoding="async"
        />
        <span className={styles.shaft} />
        <span className={styles.dark} />
      </div>
      <Particles density={0.7} />

      <div className={styles.copy}>
        <p className="overline">The Decision</p>
        <h2>
          There are two versions of you.
          <br />
          The one who enters...
          <br />
          <span className="goldWord">and the one who finishes.</span>
        </h2>
        <p className={styles.sub}>
          Everything inside this Institution exists for one purpose: to
          transform the person doing the work. The Builder who completes this
          journey will never leave as the same person who walked through the
          door.
        </p>
        <a href="#exchange" className={`btnPrimary ${styles.cta}`}>
          Enter the Institute
        </a>
      </div>
    </section>
  );
}
