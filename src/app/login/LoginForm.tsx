"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./Login.module.css";

type Step = "email" | "code";

/**
 * The Door. Step one: the ledger is checked and a six-digit combination
 * is sent from vault@. Step two: the combination turns, the vault opens.
 */
export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; reason?: string };
      if (data.ok) {
        setStep("code");
        setTimeout(() => codeRef.current?.focus(), 50);
      } else if (data.reason === "unknown") {
        setError(
          "This address isn't on the Builder ledger yet. The vault opens from the Exchange."
        );
      } else if (data.reason === "throttled") {
        setError("Too many combinations requested. Wait a few minutes and try again.");
      } else {
        setError("The Door didn't answer. Try again in a moment.");
      }
    } catch {
      setError("The Door didn't answer. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  async function enterCombination(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await signIn("combination", {
      email,
      code: code.replace(/\s/g, ""),
      redirect: false,
    });
    if (result?.error) {
      setError("That combination didn't turn. Check the six digits and try again.");
      setBusy(false);
    } else {
      router.push("/vault");
      router.refresh();
    }
  }

  return (
    <main className={styles.door}>
      <div className={styles.panel}>
        <p className="overline">The Door</p>
        <h1 className={styles.title}>
          The vault recognizes its <span className="goldWord">Builders</span>.
        </h1>

        {step === "email" ? (
          <form onSubmit={requestCode} className={styles.form}>
            <p className={styles.lede}>
              Enter the email on your Builder record. The vault will send your
              combination.
            </p>
            <label className={styles.label} htmlFor="door-email">
              Email on the ledger
            </label>
            <input
              id="door-email"
              className={styles.input}
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btnPrimary" type="submit" disabled={busy}>
              {busy ? "Checking the ledger…" : "Send my combination"}
            </button>
          </form>
        ) : (
          <form onSubmit={enterCombination} className={styles.form}>
            <p className={styles.lede}>
              Six digits are on their way to{" "}
              <span className={styles.emailEcho}>{email}</span>. They turn once,
              and expire in ten minutes.
            </p>
            <label className={styles.label} htmlFor="door-code">
              The combination
            </label>
            <input
              id="door-code"
              ref={codeRef}
              className={`${styles.input} ${styles.codeInput}`}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9\s]{6,7}"
              maxLength={7}
              required
              placeholder="000 000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^\d\s]/g, ""))}
            />
            <button className="btnPrimary" type="submit" disabled={busy}>
              {busy ? "Turning the dial…" : "Enter the vault"}
            </button>
            <button
              type="button"
              className={`btnGhost ${styles.back}`}
              onClick={() => {
                setStep("email");
                setCode("");
                setError(null);
              }}
            >
              Use a different email
            </button>
          </form>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.fine}>
          Not a Builder yet? <a href="/checkout">The Exchange is open.</a>
        </p>
      </div>
    </main>
  );
}
