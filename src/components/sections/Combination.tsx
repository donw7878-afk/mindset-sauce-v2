"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MODULES } from "@/lib/content";
import { boltClick } from "@/lib/sound";
import styles from "./Combination.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The Combination — the pause after the six chambers.
 * The six covers drift to the center, rotate into a perfect circular
 * vault combination, click into place, glow — then dissolve into light.
 * The visitor has assembled the combination. Only then does the scroll
 * carry them to the door.
 */
export default function Combination() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(`.${styles.card}`, { autoAlpha: 0 });
        gsap.set(`.${styles.coda}`, { autoAlpha: 1 });
        return;
      }

      const isMobile = window.innerWidth < 640;
      const radius = isMobile
        ? Math.min(130, window.innerWidth * 0.32)
        : Math.min(230, window.innerWidth * 0.18);
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
      let clicked = false;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: isMobile ? "+=180%" : "+=240%",
          scrub: 1.5,
          pin: `.${styles.stage}`,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (!clicked && self.progress >= 0.62 && self.direction > 0) {
              clicked = true;
              boltClick(0.35);
            }
          },
        },
      });

      // Phase A (0 → 0.6): each cover drifts in from its scatter and
      // settles onto the dial — six positions, sixty degrees apart.
      cards.forEach((card, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const scatterX = x * 3.2 + (i % 2 === 0 ? -80 : 80);
        const scatterY = y * 2.4 + 120;

        tl.fromTo(
          card,
          {
            x: scatterX,
            y: scatterY,
            rotation: i % 2 === 0 ? -14 : 14,
            autoAlpha: 0,
            scale: 0.85,
          },
          {
            x,
            y,
            rotation: i % 2 === 0 ? -4 : 4,
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          i * 0.02
        );
      });

      // Phase B (0.6 → 0.68): the click — the dial seats itself.
      tl.to(
        cards,
        { rotation: 0, scale: 1.04, duration: 0.05, ease: "power2.in" },
        0.6
      ).to(cards, { scale: 1, duration: 0.03 }, 0.65);
      tl.fromTo(
        `.${styles.ring}`,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 0.08 },
        0.6
      );
      tl.fromTo(
        `.${styles.coreGlow}`,
        { autoAlpha: 0, scale: 0.4 },
        { autoAlpha: 0.9, scale: 1, duration: 0.1, ease: "power2.out" },
        0.62
      );

      // Phase C (0.72 → 1): the combination dissolves into light.
      tl.to(
        `.${styles.flash}`,
        { autoAlpha: 0.85, duration: 0.12, ease: "power1.in" },
        0.74
      );
      tl.to(
        cards,
        { autoAlpha: 0, scale: 1.18, duration: 0.14, ease: "power1.in", stagger: 0.008 },
        0.76
      );
      tl.to(`.${styles.ring}`, { autoAlpha: 0, scale: 1.3, duration: 0.12 }, 0.76);
      tl.to(`.${styles.coreGlow}`, { autoAlpha: 0, scale: 2.2, duration: 0.16 }, 0.78);
      tl.to(`.${styles.flash}`, { autoAlpha: 0, duration: 0.1 }, 0.9);
      tl.fromTo(
        `.${styles.coda}`,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" },
        0.9
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.combination} aria-label="The Combination">
      <div className={styles.stage}>
        <span className={styles.ring} aria-hidden />
        <span className={styles.coreGlow} aria-hidden />
        {MODULES.map((m) => (
          <div key={m.n} className={styles.card} aria-hidden>
            <img src={m.image} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
        <span className={styles.flash} aria-hidden />
        <p className={`overline ${styles.coda}`}>The combination is yours</p>
      </div>
    </section>
  );
}
