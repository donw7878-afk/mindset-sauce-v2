"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { INVENTORY, BONUSES } from "@/lib/content";
import { artifactSound } from "@/lib/sound";
import styles from "./Inventory.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * S6 — Inside the Vault.
 * Warm gold-dark ambiance. The full inventory revealed piece by piece —
 * a treasury, not a features grid. The Certificate is shown locked:
 * earned at completion, not before.
 */
export default function Inventory() {
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

      gsap.utils
        .toArray<HTMLElement>(`.${styles.item}, .${styles.plaque}, .${styles.sealedCard}`)
        .forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            y: 40,
            scale: 0.9,
            duration: 1.5,
            ease: "expo.out",
            delay: (i % 3) * 0.2,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

      // Idle float on cover art
      gsap.utils.toArray<HTMLElement>(`.${styles.item} img`).forEach((img, i) => {
        gsap.to(img, {
          y: -8,
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.4,
        });
      });

      // The locked Certificate pulses gold once as it enters view
      gsap.fromTo(
        `.${styles.locked}`,
        { boxShadow: "0 0 0 rgba(218,165,32,0)" },
        {
          boxShadow: "0 0 80px rgba(218,165,32,0.25)",
          duration: 1.2,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
          scrollTrigger: { trigger: `.${styles.locked}`, start: "top 75%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="inventory" className={styles.inventory} aria-label="Inside the vault">
      <div className="container">
        <div className={styles.head}>
          <p className="overline">Inside the Vault</p>
          <h2>
            Everything the door was <span className="goldWord">protecting</span>.
          </h2>
        </div>

        <div className={styles.grid}>
          {INVENTORY.map((item) =>
            item.image ? (
              <article
                key={item.title}
                className={`${styles.item} ${item.slug ? styles[`art_${item.slug}`] ?? "" : ""}`}
                onMouseEnter={item.slug ? () => artifactSound(item.slug!) : undefined}
              >
                <div className={styles.artFrame}>
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  <span className={styles.waveform} aria-hidden>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className={styles.pageEdge} aria-hidden />
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                {item.tip && <span className={styles.tooltip}>{item.tip}</span>}
              </article>
            ) : (
              <article
                key={item.title}
                className={`${styles.plaque} ${item.slug ? styles[`art_${item.slug}`] ?? "" : ""}`}
                onMouseEnter={item.slug ? () => artifactSound(item.slug!) : undefined}
              >
                {item.cover && (
                  <span className={styles.coverReveal} aria-hidden>
                    <span className={styles.cardSlide} />
                    <img src={item.cover} alt="" loading="lazy" decoding="async" />
                    <span className={styles.motes}>
                      <span />
                      <span />
                      <span />
                    </span>
                  </span>
                )}
                <span className={styles.checkGlow} aria-hidden>
                  ✓
                </span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                {item.tip && <span className={styles.tooltip}>{item.tip}</span>}
              </article>
            )
          )}
        </div>

        <div className={styles.bonusHead}>
          <p className="overline">The Sealed Bonuses</p>
        </div>

        <div className={styles.bonusGrid}>
          {BONUSES.map((b) => (
            <article
              key={b.title}
              className={`${styles.sealedCard} ${b.locked ? styles.locked : ""} ${
                b.slug ? styles[`art_${b.slug}`] ?? "" : ""
              }`}
              onMouseEnter={b.slug ? () => artifactSound(b.slug!) : undefined}
            >
              {b.cover && (
                <span className={styles.coverReveal} aria-hidden>
                  <span className={styles.cardSlide} />
                  <img src={b.cover} alt="" loading="lazy" decoding="async" />
                  <span className={styles.motes}>
                    <span />
                    <span />
                    <span />
                  </span>
                </span>
              )}
              <span className={styles.seal} aria-hidden>
                {b.locked ? "🔒" : "◈"}
              </span>
              <h3>{b.title}</h3>
              <p>{b.copy}</p>
              {b.locked && <span className={styles.lockedTag}>Earned at completion</span>}
              {b.tip && <span className={styles.tooltip}>{b.tip}</span>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
