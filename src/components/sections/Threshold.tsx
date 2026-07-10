"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Particles from "@/components/Particles";
import styles from "./Threshold.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * S1 — The Threshold.
 * Near-total darkness. The vault door breathes. The logo hangs high in
 * the top third; the headline arrives low, close to the door's heart.
 * No CTA — the hero sells curiosity, not the product.
 */
export default function Threshold() {
  const root = useRef<HTMLElement>(null);
  const door = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Breathing: scale 1.00 → 1.015, 8s sine loop
      gsap.to(door.current, {
        scale: 1.015,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Seam light flicker
      gsap.to(`.${styles.seamLight}`, {
        opacity: 0.55,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.8,
      });

      // Logo descends into place first, then headline words rise, 100ms stagger
      gsap.from(`.${styles.logoBlock} > *`, {
        opacity: 0,
        y: -24,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
      });
      gsap.from(`.${styles.rise}`, {
        opacity: 0,
        y: 40,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.4,
      });

      // Door recedes into darkness as S2 approaches (0.3x parallax feel)
      gsap.to(`.${styles.doorScene}`, {
        yPercent: 20,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: root }
  );

  // Mouse parallax ±5° on the door (desktop only)
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(door.current, {
        rotateY: nx * 5,
        rotateX: -ny * 5,
        duration: 1.2,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={root} id="top" className={styles.threshold}>
      <div className={styles.doorScene}>
        <div className={styles.perspective}>
          <div ref={door} className={styles.door}>
            <img
              src="/images/vault-door.png"
              alt="The sealed vault of The Mindset Sauce Institute"
              fetchPriority="high"
              decoding="async"
            />
            <div className={styles.seamLight} aria-hidden />
          </div>
        </div>
        <Particles />
        <div className={styles.vignette} aria-hidden />
      </div>

      {/* Logo lockup — high, in the top third. Brush "Sauce" → logo asset, per brand rule */}
      <div className={styles.logoBlock}>
        <img src="/images/logo.png" alt="The Mindset Sauce" className={styles.logo} />
        <p className="overline">Institute™</p>
      </div>

      <div className={styles.copy}>
        <h1 className={styles.rise}>
          Build your mind.
          <br />
          <em className={styles.em}>The results will follow.</em>
        </h1>
        <p className={`${styles.sub} ${styles.rise}`}>
          A six-module transformation system designed to rebuild the one thing
          that builds everything else:
          <br />
          <span className={styles.subEm}>your mind.</span>
        </p>
      </div>

      <div className={styles.scrollCue} aria-hidden>
        <span>The vault is sealed. Scroll to approach.</span>
        <span className={styles.cueLine} />
      </div>
    </section>
  );
}
