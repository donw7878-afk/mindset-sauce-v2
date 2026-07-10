"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Particles from "@/components/Particles";
import { boltClick, deepRelease, doorGroan, goldTone } from "@/lib/sound";
import styles from "./Unlocking.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * S5 — The Unlocking. The signature set piece.
 *
 * Pinned scroll-scrubbed sequence (~500vh desktop, ~250vh mobile —
 * the door is massive steel; it is never rushed):
 *   Phase A (0–30%):   the wheel mechanism turns (a circular-clipped copy
 *                      of the door art spins over the static door).
 *   Phase B (30–50%):  five bolts release — each with a micro-vibration
 *                      through the steel and a step of seam light.
 *   Phase C (50–85%):  the door swings on its hinges, dust falls from
 *                      them, and warm volumetric light spills outward.
 *   Phase D (85–100%): the camera passes through into the vault — rays,
 *                      drifting fog, suspended dust. A cathedral for the
 *                      mind, not a fantasy.
 *
 * Sound (opt-in via the nav toggle): bolt clicks, a deep release as the
 * door frees, a warm tone as the gold light floods.
 */
export default function Unlocking() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Static fallback: door open, interior visible and alive only in stillness
        gsap.set(`.${styles.door}`, { autoAlpha: 0 });
        gsap.set(`.${styles.interior}`, { autoAlpha: 1, scale: 1.15 });
        gsap.set(`.${styles.flood}`, { autoAlpha: 0.5 });
        gsap.set(`.${styles.atmosphere}`, { autoAlpha: 1 });
        gsap.set(`.${styles.insideCopy}`, { autoAlpha: 1 });
        return;
      }

      const isDesktop = window.innerWidth >= 1024;
      const boltTimes = [0.3, 0.34, 0.38, 0.42, 0.46];
      const fired = new Set<number>();
      let released = false;
      let toned = false;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: isDesktop ? "+=500%" : "+=250%",
          scrub: 2,
          pin: `.${styles.stage}`,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.direction < 0) return;
            boltTimes.forEach((t, i) => {
              if (!fired.has(i) && self.progress >= t) {
                fired.add(i);
                boltClick();
              }
            });
            if (!released && self.progress >= 0.5) {
              released = true;
              deepRelease();
              doorGroan();
            }
            if (!toned && self.progress >= 0.62) {
              toned = true;
              goldTone();
            }
          },
        },
      });

      // ---- Phase A (0 → 0.30): the mechanism turns
      tl.to(`.${styles.wheel}`, { rotation: -150, duration: 0.3 }, 0);
      tl.to(`.${styles.seam}`, { opacity: 0.35, duration: 0.3 }, 0);

      // ---- Phase B (0.30 → 0.50): five bolts release, steel shudders
      boltTimes.forEach((at, i) => {
        // Brightness flash + micro-vibration through the door
        tl.to(`.${styles.door}`, { filter: "brightness(0.85)", duration: 0.008 }, at)
          .to(`.${styles.door}`, { filter: "brightness(0.55)", duration: 0.03 }, at + 0.008);
        tl.fromTo(
          `.${styles.perspective}`,
          { x: 0 },
          { x: i % 2 === 0 ? 3 : -3, duration: 0.006, yoyo: true, repeat: 1 },
          at
        );
        tl.to(`.${styles.seam}`, { opacity: 0.35 + (i + 1) * 0.13, duration: 0.04 }, at);
      });
      tl.to(
        `.${styles.bolt}`,
        { scaleX: 0, duration: 0.035, stagger: 0.04, transformOrigin: "left center" },
        0.31
      );

      // ---- Phase C (0.50 → 0.85): the door swings — slow, massive, earned
      tl.to(
        `.${styles.door}`,
        { rotateY: -84, duration: 0.35, ease: "power2.inOut" },
        0.5
      );
      // Dust shaken loose from the hinges as the mass moves
      tl.fromTo(
        `.${styles.hingeDust} span`,
        { autoAlpha: 0, y: 0 },
        {
          autoAlpha: 0.55,
          y: () => 40 + Math.random() * 70,
          duration: 0.12,
          stagger: 0.012,
          ease: "power1.in",
        },
        0.52
      ).to(`.${styles.hingeDust} span`, { autoAlpha: 0, duration: 0.08 }, 0.66);
      tl.to(`.${styles.flood}`, { autoAlpha: 1, scale: 1.6, duration: 0.3 }, 0.52);
      tl.to(`.${styles.seam}`, { opacity: 0, duration: 0.1 }, 0.56);
      tl.to(`.${styles.interior}`, { autoAlpha: 1, duration: 0.2 }, 0.54);
      tl.to(`.${styles.atmosphere}`, { autoAlpha: 1, duration: 0.25 }, 0.6);

      // ---- Phase D (0.85 → 1): dolly through the opening, into stillness
      tl.to(`.${styles.interior}`, { scale: 1.45, duration: 0.15, ease: "power1.in" }, 0.85);
      tl.to(`.${styles.door}`, { autoAlpha: 0, duration: 0.06 }, 0.87);
      tl.to(`.${styles.flood}`, { autoAlpha: 0.3, duration: 0.13 }, 0.87);
      tl.fromTo(
        `.${styles.insideCopy}`,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" },
        0.9
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.unlocking} aria-label="The vault opens">
      <div className={styles.stage}>
        {/* Interior — revealed behind the door */}
        <div className={styles.interior}>
          <img src="/images/vault-interior.png" alt="Inside the vault" decoding="async" />
        </div>

        {/* Atmosphere: rays, fog, polished-stone sheen — believable, sacred */}
        <div className={styles.atmosphere} aria-hidden>
          <span className={styles.ray} />
          <span className={`${styles.ray} ${styles.rayTwo}`} />
          <span className={styles.fog} />
          <span className={`${styles.fog} ${styles.fogTwo}`} />
          <span className={styles.floorSheen} />
        </div>

        {/* Volumetric gold flood */}
        <div className={styles.flood} aria-hidden />

        {/* The door, hinged left */}
        <div className={styles.perspective}>
          <div className={styles.door}>
            <img src="/images/vault-door.png" alt="" aria-hidden decoding="async" />
            {/* The wheel: same artwork, circular clip, rotates */}
            <div className={styles.wheel} aria-hidden>
              <img src="/images/vault-door.png" alt="" decoding="async" />
            </div>
            {/* Bolts retract along the edge */}
            <div className={styles.bolts} aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={styles.bolt} style={{ top: `${18 + i * 16}%` }} />
              ))}
            </div>
            {/* Dust shaken from the hinges */}
            <div className={styles.hingeDust} aria-hidden>
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} style={{ top: `${12 + i * 8}%`, left: `${Math.random() * 5}%` }} />
              ))}
            </div>
          </div>
          <div className={styles.seam} aria-hidden />
        </div>

        <Particles density={1.4} />

        <div className={styles.insideCopy}>
          <p className="overline">You did that</p>
          <h2>
            The vault is <span className="goldWord">open</span>.
          </h2>
        </div>
      </div>
    </section>
  );
}
