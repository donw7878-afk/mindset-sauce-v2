"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import Particles from "@/components/Particles";
import VaultWelcome from "@/components/VaultWelcome";
import {
  ASSESSMENT,
  COUPON_CODE,
  EARLY_PRICE,
  LEDGER_TOTAL,
  REGULAR_PRICE,
  computeReport,
  builderNumberFor,
  type BuilderReport,
} from "@/lib/content";
import { heartbeat, breathIn } from "@/lib/sound";
import styles from "./Assessment.module.css";

export const UNLOCK_KEY = "msi_builder_unlock";
export const NUMBER_KEY = "msi_builder_number";
export const EMAIL_KEY = "msi_builder_email";
export const NAME_KEY = "msi_builder_name";

type Stage = "intro" | "questions" | "evaluating" | "gate" | "reveal" | "welcome";

const fade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

const EVAL_LINES = [
  "Evaluating your Builder Profile...",
  "Measuring Builder Readiness...",
  "Identifying your Builder Archetype...",
  "Preparing your Institute Invitation...",
];

/** Staged reveal delays (seconds) — identity first, math never. */
const REVEAL_AT = {
  archetype: 0.6,
  readiness: 2.4,
  obstacle: 4.2,
  interpretation: 5.8,
  number: 8.2,
  tuition: 9.4,
};

const rise = (at: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: at, duration: 1.1, ease: [0.16, 1, 0.3, 1] as const },
});

/**
 * The Builder Assessment — the first experience inside the Institute.
 * Seven questions → a ceremonial evaluation → the Builder Report gate →
 * an identity-first staged reveal → the Private Builder Tuition™ →
 * "Welcome, Builder №—. The vault has opened."
 */
export default function Assessment({
  onUnlock,
  onClose,
}: {
  onUnlock: (readiness: number) => void;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [evalLine, setEvalLine] = useState(-1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [builderNo, setBuilderNo] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const readinessRef = useRef<HTMLSpanElement>(null);
  const reportRef = useRef<BuilderReport | null>(null);

  // Lock page scroll while open; Escape closes (except during the welcome)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const answer = (idx: number) => {
    const next = [...answers, idx];
    setAnswers(next);
    if (step + 1 < ASSESSMENT.length) {
      setStep(step + 1);
    } else {
      reportRef.current = computeReport(next);
      setStage("evaluating");
    }
  };

  // The ceremony: black, heartbeat, breath, lines arriving one at a time
  useEffect(() => {
    if (stage !== "evaluating") return;
    heartbeat(4);
    breathIn();
    const timers: ReturnType<typeof setTimeout>[] = [];
    EVAL_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setEvalLine(i), 900 + i * 1400));
    });
    // The lockup: "Builder Evaluation Complete"
    timers.push(setTimeout(() => setEvalLine(EVAL_LINES.length), 900 + EVAL_LINES.length * 1400));
    // Hold, then the gate
    timers.push(
      setTimeout(() => setStage("gate"), 900 + EVAL_LINES.length * 1400 + 2600)
    );
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (cleanName.length < 2) {
      setError("Your name, Builder.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError("That email doesn't look complete.");
      return;
    }
    setError("");
    setSubmitting(true);

    const report = reportRef.current!;
    const number = builderNumberFor(cleanEmail);
    setBuilderNo(number);

    // Store the lead; the reveal proceeds even if the network call fails —
    // the visitor should never be punished for our infrastructure.
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          score: report.readiness,
          answers,
          archetype: report.archetype.title,
          obstacle: report.obstacle,
          builderNumber: number,
        }),
      });
    } catch {
      /* non-blocking */
    }

    try {
      localStorage.setItem(UNLOCK_KEY, String(report.readiness));
      localStorage.setItem(NUMBER_KEY, number);
      // The Exchange prefills from these — the Builder never retypes.
      localStorage.setItem(EMAIL_KEY, cleanEmail);
      localStorage.setItem(NAME_KEY, cleanName);
    } catch {
      /* private mode */
    }

    setSubmitting(false);
    setStage("reveal");
    onUnlock(report.readiness);
  };

  // Builder Readiness™ rolls up from zero — after identity has landed
  useEffect(() => {
    if (stage !== "reveal" || !readinessRef.current) return;
    const target = reportRef.current?.readiness ?? 0;
    const counter = { v: 0 };
    const tween = gsap.to(counter, {
      v: target,
      duration: 1.6,
      delay: REVEAL_AT.readiness,
      ease: "power2.out",
      onUpdate: () => {
        if (readinessRef.current)
          readinessRef.current.textContent = String(Math.round(counter.v));
      },
    });
    return () => {
      tween.kill();
    };
  }, [stage]);

  const report = reportRef.current;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-label="The Builder Assessment"
    >
      <div className={`${styles.panel} ${stage === "evaluating" ? styles.panelDark : ""}`}>
        {stage !== "evaluating" && stage !== "welcome" && (
          <button className={styles.close} onClick={onClose} aria-label="Close assessment">
            ✕
          </button>
        )}

        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div key="intro" className={styles.stageBox} {...fade}>
              <p className="overline">The Builder Assessment</p>
              <h3 className={styles.title}>Seven questions. One honest mirror.</h3>
              <p className={styles.copy}>
                Answer as the person you are today — not the person you intend
                to be. Your Builder Readiness™, your Builder Archetype™, and
                your private Institute invitation wait on the other side.
              </p>
              <button className="btnPrimary" onClick={() => setStage("questions")}>
                Begin the Assessment
              </button>
            </motion.div>
          )}

          {stage === "questions" && (
            <motion.div key={`q${step}`} className={styles.stageBox} {...fade}>
              <p className={styles.progress}>
                {String(step + 1).padStart(2, "0")} / {String(ASSESSMENT.length).padStart(2, "0")}
              </p>
              <h3 className={styles.question}>{ASSESSMENT[step].q}</h3>
              <div className={styles.options}>
                {ASSESSMENT[step].options.map((opt, i) => (
                  <button key={i} className={styles.option} onClick={() => answer(i)}>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {stage === "evaluating" && (
            <motion.div
              key="evaluating"
              className={styles.ceremony}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Particles density={0.5} />
              <div className={styles.evalLines} aria-live="polite">
                {EVAL_LINES.map((line, i) => (
                  <p
                    key={line}
                    className={`${styles.evalLine} ${evalLine === i ? styles.evalLineOn : ""} ${
                      evalLine > i ? styles.evalLineDone : ""
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <div
                className={`${styles.evalLockup} ${
                  evalLine >= EVAL_LINES.length ? styles.evalLockupOn : ""
                }`}
              >
                <p className={styles.evalBrand}>The Mindset Sauce Institute™</p>
                <p className={styles.evalComplete}>Builder Evaluation Complete</p>
              </div>
            </motion.div>
          )}

          {stage === "gate" && (
            <motion.div key="gate" className={styles.stageBox} {...fade}>
              <p className="overline">Your Builder Report Is Ready</p>
              <ul className={styles.gateList}>
                <li>Your Builder Profile has been created.</li>
                <li>Your Builder Readiness™ has been calculated.</li>
                <li>Your Builder Archetype™ has been identified.</li>
                <li>Your Private Builder Tuition™ has been unlocked.</li>
              </ul>
              <p className={styles.copy}>Enter your name and email to reveal everything.</p>
              <form className={styles.form} onSubmit={submit} noValidate>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {error && <p className={styles.error}>{error}</p>}
                <button className="btnPrimary" type="submit" disabled={submitting}>
                  {submitting ? "Sealing…" : "Reveal My Builder Report"}
                </button>
              </form>
              <p className={styles.fine}>
                No spam. No newsletters. Only your Builder Report, your
                Institute invitation, and letters worth keeping.
              </p>
            </motion.div>
          )}

          {stage === "reveal" && report && (
            <motion.div key="reveal" className={styles.stageBox} {...fade}>
              {/* Identity first. Always. */}
              <motion.div className={styles.archetypeBlock} {...rise(REVEAL_AT.archetype)}>
                <p className="overline">Builder Archetype™</p>
                <h3 className={styles.archetype}>{report.archetype.title}</h3>
                <p className={styles.strength}>{report.archetype.strength}</p>
              </motion.div>

              <motion.div className={styles.metricRow} {...rise(REVEAL_AT.readiness)}>
                <div className={styles.metric}>
                  <p className={styles.metricLabel}>Builder Readiness™</p>
                  <p className={styles.readiness}>
                    <span ref={readinessRef}>0</span>
                    <span className={styles.readinessOf}>/ 100</span>
                  </p>
                </div>
                <motion.div className={styles.metric} {...rise(REVEAL_AT.obstacle)}>
                  <p className={styles.metricLabel}>Primary Obstacle™</p>
                  <p className={styles.obstacle}>{report.obstacle}</p>
                </motion.div>
              </motion.div>

              <motion.div className={styles.interpretation} {...rise(REVEAL_AT.interpretation)}>
                {report.archetype.interpretation.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: REVEAL_AT.interpretation + 0.4 + i * 0.5, duration: 0.9 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.div>

              <motion.div className={styles.numberBlock} {...rise(REVEAL_AT.number)}>
                <p className={styles.metricLabel}>Builder No.</p>
                <p className={styles.builderNo}>{builderNo}</p>
                <p className={styles.numberFine}>Your permanent Institute identity.</p>
              </motion.div>

              <motion.div className={styles.offer} {...rise(REVEAL_AT.tuition)}>
                <div className={styles.tuitionRows}>
                  <div className={styles.tuitionRow}>
                    <span>Institute Value</span>
                    <span className={styles.tuitionValue}>
                      ${LEDGER_TOTAL.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className={styles.tuitionRow}>
                    <span>Public Tuition</span>
                    <span className={styles.tuitionValue}>${REGULAR_PRICE}</span>
                  </div>
                  <div className={`${styles.tuitionRow} ${styles.tuitionPrivate}`}>
                    <span>Private Builder Tuition™</span>
                    <span className={styles.tuitionPrice}>${EARLY_PRICE}</span>
                  </div>
                </div>
                <p className={styles.unlockMsg}>
                  Builder Invitation Code&nbsp;
                  <span className={styles.code}>{COUPON_CODE}</span>
                </p>
                {/* The vault opens, then carries the Builder into the Exchange */}
                <button className="btnPrimary" onClick={() => setStage("welcome")}>
                  Enter the Institute
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {stage === "welcome" && (
          <VaultWelcome
            builderNumber={builderNo}
            onDone={onClose}
            href={`/checkout?code=${COUPON_CODE}`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
