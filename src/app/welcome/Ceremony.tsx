"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Ceremony.module.css";

gsap.registerPlugin(useGSAP);

/**
 * The post-purchase ceremony. Seen once, remembered longer.
 * Black screen → (user-initiated, so audio is permitted) vault unlock
 * sound → gold light flood → ACCESS GRANTED → Welcome, Builder →
 * Owner's Manual: Start Here First.
 *
 * The unlock sound is synthesized with the Web Audio API per spec §15 —
 * mechanical and metallic, no music, nothing until the visitor acts.
 */
export default function Ceremony({
  builderName,
  builderNumber,
}: {
  builderName?: string;
  builderNumber?: string;
} = {}) {
  const root = useRef<HTMLDivElement>(null);
  const [begun, setBegun] = useState(false);
  const firstName = builderName?.trim().split(/\s+/)[0];

  const playUnlockSound = () => {
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);

      // Deep resonant unlock: low sine swell
      const swell = ctx.createOscillator();
      swell.type = "sine";
      swell.frequency.setValueAtTime(46, ctx.currentTime);
      swell.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 2.2);
      const swellGain = ctx.createGain();
      swellGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      swellGain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.25);
      swellGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);
      swell.connect(swellGain).connect(master);
      swell.start();
      swell.stop(ctx.currentTime + 2.5);

      // Two heavy metallic bolt clicks
      [0.15, 0.55].forEach((at) => {
        const click = ctx.createOscillator();
        click.type = "square";
        click.frequency.value = 190;
        const band = ctx.createBiquadFilter();
        band.type = "bandpass";
        band.frequency.value = 900;
        band.Q.value = 6;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, ctx.currentTime + at);
        g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + at + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + 0.22);
        click.connect(band).connect(g).connect(master);
        click.start(ctx.currentTime + at);
        click.stop(ctx.currentTime + at + 0.3);
      });

      // Warm harmonic tone as the gold light floods (3s fade)
      const tone = ctx.createOscillator();
      tone.type = "sine";
      tone.frequency.value = 220;
      const toneGain = ctx.createGain();
      toneGain.gain.setValueAtTime(0.0001, ctx.currentTime + 1.2);
      toneGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 2.6);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5);
      tone.connect(toneGain).connect(master);
      tone.start(ctx.currentTime + 1.2);
      tone.stop(ctx.currentTime + 5.2);
    } catch {
      /* sound is a gift, never a requirement */
    }
  };

  const begin = () => {
    if (begun) return;
    // Sound must start inside the user gesture; the animation itself
    // waits for React to render the stage (see useGSAP below).
    playUnlockSound();
    setBegun(true);
  };

  // The ceremony timeline runs AFTER the stage is in the DOM — building
  // it inside the click handler binds GSAP to elements React hasn't
  // rendered yet, which is exactly how the manual card got lost.
  useGSAP(
    () => {
      if (!begun) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (reduced) {
        tl.set(`.${styles.gate}`, { autoAlpha: 0 })
          .set(`.${styles.flood}`, { autoAlpha: 0.5 })
          .set(`.${styles.access}`, { autoAlpha: 1 })
          .set(`.${styles.welcome} > *`, { autoAlpha: 1 })
          .set(`.${styles.manual}`, { autoAlpha: 1 })
          .set(`.${styles.dashboardCta}`, { autoAlpha: 1 })
          .set(`.${styles.inboxNote}`, { autoAlpha: 1 });
        return;
      }

      // Ceremony: 3s vault opening cadence — heavy, mechanical, earned
      tl.to(`.${styles.gate}`, { autoAlpha: 0, duration: 0.6 });
      tl.fromTo(
        `.${styles.flood}`,
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1.4, duration: 2.4, ease: "power1.inOut" },
        0.4
      );
      tl.fromTo(
        `.${styles.access}`,
        { autoAlpha: 0, letterSpacing: "18px" },
        { autoAlpha: 1, letterSpacing: "8px", duration: 1.5, ease: "expo.out" },
        1.6
      );
      tl.to(`.${styles.flood}`, { autoAlpha: 0.35, duration: 1.2 }, 2.8);
      tl.fromTo(
        `.${styles.welcome} > *`,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 1.5, ease: "expo.out", stagger: 0.15 },
        3.2
      );
      tl.fromTo(
        `.${styles.manual}`,
        { autoAlpha: 0, y: 40, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: "expo.out" },
        4.0
      );
      tl.fromTo(
        `.${styles.dashboardCta}`,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out" },
        4.6
      );
      tl.fromTo(
        `.${styles.inboxNote}`,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.2, ease: "power1.out" },
        5.0
      );
    },
    { dependencies: [begun], scope: root }
  );

  return (
    <div ref={root} className={styles.ceremony}>
      <div className={styles.flood} aria-hidden />

      {/* The gate — black screen, one action */}
      <div className={styles.gate}>
        <p className="overline">The Mindset Sauce Institute™</p>
        <p className={styles.gateLine}>The vault recognizes you.</p>
        <button className="btnPrimary" onClick={begin}>
          Enter the Vault
        </button>
        <p className={styles.gateFine}>Sound on is recommended.</p>
      </div>

      {!begun ? null : (
        <div className={styles.stage}>
          <p className={styles.access}>Access Granted</p>
          <div className={styles.welcome}>
            <h1>
              Welcome, <span className={styles.gold}>{firstName ?? "Builder"}</span>.
            </h1>
            <p className={styles.sub}>
              What you unlocked today doesn&rsquo;t work because you bought it.
              It works because you will.
            </p>
            {builderNumber && (
              <p className={styles.builderLine}>
                Builder {builderNumber} — recorded in the Institute ledger.
              </p>
            )}
          </div>

          <a
            className={styles.manual}
            href="/downloads/owners-manual.pdf"
            target="_blank"
            rel="noopener"
          >
            <span className={styles.manualBadge}>Start Here First</span>
            <span className={styles.manualTitle}>The Owner&rsquo;s Manual</span>
            <span className={styles.manualCopy}>
              Ten minutes. How to run the system — and yourself — for life.
            </span>
          </a>

          <a className={`btnPrimary ${styles.dashboardCta}`} href="/vault">
            Enter Your Vault
          </a>

          <p className={styles.inboxNote}>
            Check your inbox for your Access Granted email from
            vault@themindsetsauce.com. If you don&rsquo;t see it, check your
            spam folder and mark it &lsquo;Not Spam&rsquo; &mdash; the vault
            always delivers.
          </p>
        </div>
      )}
    </div>
  );
}
