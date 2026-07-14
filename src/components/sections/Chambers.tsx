"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MODULES, CHAPTERS } from "@/lib/content";
import styles from "./Chambers.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * S4 — The Six Chambers.
 * Each module cover presented like a watch on velvet: floating,
 * shadowed, revealed in sequence, with its four audio chapters
 * engraved beneath. Alternating layout, editorial rhythm.
 */
export default function Chambers() {
  const root = useRef<HTMLElement>(null);
  // Touch screens have no hover: tapping a chapter opens its plaque
  // inline instead (desktop keeps the floating museum plaque).
  const [openPlaque, setOpenPlaque] = useState<string | null>(null);
  const togglePlaque = (key: string) =>
    setOpenPlaque((cur) => (cur === key ? null : key));

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const isDesktop = window.innerWidth >= 1024;

      gsap.from(`.${styles.head} > *`, {
        opacity: 0,
        y: 40,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: `.${styles.head}`, start: "top 80%" },
      });

      gsap.utils.toArray<HTMLElement>(`.${styles.chamber}`).forEach((chamber) => {
        const art = chamber.querySelector(`.${styles.art}`);
        const info = chamber.querySelectorAll(`.${styles.info} > *`);

        // Floating-product reveal — spec §13
        gsap.from(art, {
          opacity: 0,
          y: 40,
          scale: 0.9,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: { trigger: chamber, start: "top 80%" },
        });
        gsap.from(info, {
          opacity: 0,
          y: 30,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          delay: 0.2,
          scrollTrigger: { trigger: chamber, start: "top 80%" },
        });

        // Idle float: 8px amplitude, 4s sine cycle — on the inner image so it
        // never fights the reveal tween's `y` on the wrapper
        gsap.to(chamber.querySelector(`.${styles.art} img`), {
          y: -8,
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random(),
        });

        // Scroll-linked ±5° Y rotation (desktop; parallax off on mobile)
        if (isDesktop) {
          gsap.fromTo(
            art,
            { rotateY: -5 },
            {
              rotateY: 5,
              ease: "none",
              scrollTrigger: {
                trigger: chamber,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        }
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="chambers" className={styles.chambers} aria-label="The Six Chambers">
      <div className="container">
        <div className={styles.head}>
          <p className="overline">The System</p>
          <h2>
            Six chambers. <span className="goldWord">One combination.</span>
          </h2>
          <p className={styles.lede}>
            Each module is a chamber of the vault, opened in order. Four audio
            chapters each — an opening, a core teaching, a practice, and a
            close. Twenty-four chapters in total. Nothing skipped, nothing
            rushed.
          </p>
        </div>

        <div className={styles.list}>
          {MODULES.map((m, i) => (
            <article
              key={m.n}
              className={`${styles.chamber} ${i % 2 === 1 ? styles.flipped : ""}`}
            >
              <div className={styles.artWrap}>
                <div className={styles.art}>
                  <img
                    src={m.image}
                    alt={`Module ${m.n} — ${m.title}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={styles.artShadow} aria-hidden />
                </div>
              </div>

              <div className={styles.info}>
                <p className={styles.numeral}>{m.numeral}</p>
                <h3>{m.title}</h3>
                <p className={styles.subtitle}>{m.subtitle}</p>
                <p className={styles.line}>{m.line}</p>
                <ul className={styles.chapters}>
                  {CHAPTERS.map((c, ci) => {
                    const key = `${m.n}-${ci}`;
                    const open = openPlaque === key;
                    return (
                      <li
                        key={c}
                        className={`${styles.chapterItem} ${open ? styles.chapterOpen : ""}`}
                        tabIndex={0}
                        role="button"
                        aria-expanded={open}
                        onClick={() => togglePlaque(key)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            togglePlaque(key);
                          }
                        }}
                      >
                        <span className={styles.chapterLabel}>{c}</span>
                        {/* Museum plaque — read beside the artifact, never over it */}
                        <div className={styles.plaquePanel} role="tooltip">
                          <span className={styles.plaqueAccent} aria-hidden />
                          <h4 className={styles.plaqueTitle}>{m.chapters[ci].title}</h4>
                          <p className={styles.plaqueDesc}>{m.chapters[ci].desc}</p>
                          <p className={styles.plaqueMeta}>{m.chapters[ci].meta}</p>
                        </div>
                        {/* Touch: the same plaque, unfolding beneath the tap */}
                        <div className={styles.plaqueInline} aria-hidden={!open}>
                          <div className={styles.plaqueInlineClip}>
                            <div className={styles.plaqueInlineBody}>
                              <span className={styles.plaqueAccent} aria-hidden />
                              <h4 className={styles.plaqueTitle}>{m.chapters[ci].title}</h4>
                              <p className={styles.plaqueDesc}>{m.chapters[ci].desc}</p>
                              <p className={styles.plaqueMeta}>{m.chapters[ci].meta}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
