"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence } from "framer-motion";
import Assessment, { UNLOCK_KEY, NUMBER_KEY } from "@/components/Assessment";
import VaultWelcome from "@/components/VaultWelcome";
import {
  LEDGER_ITEMS,
  LEDGER_TOTAL,
  REGULAR_PRICE,
  EARLY_PRICE,
  COUPON_CODE,
} from "@/lib/content";
import styles from "./Ledger.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

/**
 * S8 — The Exchange.
 * The visitor is not buying information; they are exchanging one
 * identity for another. Values roll up, the total tallies, the regular
 * tuition is struck through — and the Private Builder Tuition™ stays
 * sealed until the Builder Assessment is passed.
 */
export default function Ledger() {
  const root = useRef<HTMLElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [welcoming, setWelcoming] = useState(false);
  const [builderNo, setBuilderNo] = useState("");

  // Returning visitors who already passed the gate stay unlocked
  useEffect(() => {
    try {
      if (localStorage.getItem(UNLOCK_KEY) !== null) setUnlocked(true);
      setBuilderNo(localStorage.getItem(NUMBER_KEY) ?? "");
    } catch {
      /* private mode */
    }
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: `.${styles.doc}`, start: "top 65%" },
      });

      // Exclude the total row here — it has its own entrance below, and
      // letting both tweens claim it made "Institute Value" flash then vanish.
      tl.from(`.${styles.row}:not(.${styles.totalRow})`, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.15,
      });

      // Monospace counters roll up
      gsap.utils.toArray<HTMLElement>(`.${styles.value}[data-value]`).forEach((el, i) => {
        const target = Number(el.dataset.value);
        const counter = { v: 0 };
        tl.to(
          counter,
          {
            v: target,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = fmt(Math.round(counter.v));
            },
          },
          0.2 + i * 0.15
        );
      });

      tl.from(`.${styles.totalRow}`, { opacity: 0, y: 24, duration: 0.8, ease: "expo.out" }, ">-0.2");

      // Regular price appears, then the gold slash strikes through it
      tl.from(`.${styles.regular}`, { opacity: 0, y: 24, duration: 0.8, ease: "expo.out" });
      tl.fromTo(
        `.${styles.slash}`,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
        ">0.1"
      );

      // The gold rule draws, then the offer block reveals
      tl.fromTo(
        `.${styles.rule}`,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "power2.inOut" }
      );
      tl.from(`.${styles.offerZone}`, {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "expo.out",
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="exchange" className={styles.ledger} aria-label="The Exchange">
      <div className="container">
        <div className={styles.head}>
          <p className="overline">The Exchange</p>
          <h2>
            An honest <span className="goldWord">appraisal</span>.
          </h2>
          <p className={styles.lede}>
            You are not buying information. You are exchanging one identity
            for another.
          </p>
        </div>

        <div className={styles.doc}>
          {LEDGER_ITEMS.map((item) => (
            <div key={item.label} className={styles.row}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.dots} aria-hidden />
              <span className={styles.value} data-value={item.value}>
                $0
              </span>
            </div>
          ))}

          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.label}>Institute Value</span>
            <span className={styles.dots} aria-hidden />
            <span className={styles.value} data-value={LEDGER_TOTAL}>
              $0
            </span>
          </div>

          <div className={styles.regular}>
            <span className={styles.regularLabel}>Public Tuition</span>
            <span className={styles.regularPrice}>
              {fmt(REGULAR_PRICE)}
              <span className={styles.slash} aria-hidden />
            </span>
          </div>

          <div className={styles.privateRow}>
            <span className={styles.regularLabel}>Private Builder Tuition™</span>
            <span className={styles.privateState}>
              {unlocked ? fmt(EARLY_PRICE) : "Unlocked after the Builder Assessment"}
            </span>
          </div>

          <span className={styles.rule} aria-hidden />

          <div className={styles.offerZone}>
            {unlocked ? (
              <div className={styles.unlockedBox}>
                <p className={styles.offerLabel}>Private Builder Tuition™</p>
                <p className={styles.price}>{fmt(EARLY_PRICE)}</p>
                <p className={styles.unlockMsg}>
                  Your Private Builder Tuition™ has been unlocked.
                  <br />
                  Builder Invitation Code&nbsp;
                  <span className={styles.code}>{COUPON_CODE}</span>
                </p>
                {/* Phase Two: this becomes the Stripe Checkout entrance */}
                <button
                  className={`btnPrimary ${styles.cta}`}
                  onClick={() => setWelcoming(true)}
                >
                  Enter the Institute
                </button>
              </div>
            ) : (
              <div className={styles.lockedBox}>
                <span className={styles.lockMark} aria-hidden>
                  🔒
                </span>
                <h3 className={styles.lockedTitle}>Unlock Your Builder Invitation</h3>
                <p className={styles.lockedCopy}>
                  Complete the Builder Assessment.
                  <br />
                  Receive your Builder Profile.
                  <br />
                  Unlock your private Builder Tuition.
                </p>
                <button
                  className={`btnPrimary ${styles.cta}`}
                  onClick={() => setAssessmentOpen(true)}
                >
                  Take the Builder Assessment
                </button>
              </div>
            )}

            <div className={styles.guarantee}>
              <span className={styles.sealMark} aria-hidden>
                ◈
              </span>
              <div>
                <h3 className={styles.guaranteeTitle}>45-Day Builder Guarantee</h3>
                <p>
                  Complete the work. If you genuinely believe this Institute
                  wasn&rsquo;t worth your investment, email us within 45 days and
                  every dollar will be returned. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {assessmentOpen && (
          <Assessment
            onUnlock={() => {
              setUnlocked(true);
              try {
                setBuilderNo(localStorage.getItem(NUMBER_KEY) ?? "");
              } catch {
                /* private mode */
              }
            }}
            onClose={() => setAssessmentOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {welcoming && (
          <VaultWelcome
            builderNumber={builderNo || "—"}
            onDone={() => setWelcoming(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
