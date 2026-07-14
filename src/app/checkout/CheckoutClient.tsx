"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { COUPON_CODE, LEDGER_TOTAL, REGULAR_PRICE } from "@/lib/content";
import { UNLOCK_KEY, NUMBER_KEY, EMAIL_KEY, NAME_KEY } from "@/components/Assessment";
import styles from "./Checkout.module.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

/**
 * The Exchange, final chamber — a Stripe Payment Element dressed in the
 * design system (spec §tokens: void ground, onyx panel, gold ramp,
 * mechanical easing). Amounts are quoted server-side; the client never
 * does its own coupon math. On success Stripe returns the Builder to
 * /welcome, where the ceremony verifies the payment before it plays.
 */

// Payment Element appearance — transcribed from globals.css tokens.
const appearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#daa520",
    colorBackground: "#121212",
    colorText: "#ede8dd",
    colorTextSecondary: "#8a8578",
    colorTextPlaceholder: "#666666",
    colorDanger: "#c0392b",
    fontFamily: "Outfit, Helvetica, sans-serif",
    fontSizeBase: "15px",
    borderRadius: "6px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      backgroundColor: "#0d0d0d",
      border: "1px solid #2a2a2a",
      boxShadow: "none",
    },
    ".Input:focus": {
      border: "1px solid #daa520",
      boxShadow: "0 0 0 1px rgba(218, 165, 32, 0.25)",
    },
    ".Label": {
      color: "#8a8578",
      fontSize: "11px",
      letterSpacing: "2px",
      textTransform: "uppercase",
    },
    ".Tab": { backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a" },
    ".Tab--selected": {
      border: "1px solid #daa520",
      boxShadow: "0 0 20px rgba(218, 165, 32, 0.15)",
    },
  },
};

const fonts = [
  { cssSrc: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap" },
];

const fmt = (cents: number) => `$${(cents / 100).toLocaleString("en-US")}`;

type Quote = {
  listAmount: number;
  discount: number;
  amount: number;
  code: string | null;
  invalidCode?: boolean;
};

export default function CheckoutClient() {
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [builderNumber, setBuilderNumber] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [codeError, setCodeError] = useState("");
  const [quoting, setQuoting] = useState(false);

  // Prefill from the Builder's journey: query params first, vault memory second.
  useEffect(() => {
    let storedEmail = "", storedName = "", storedNo = "", unlocked = false;
    try {
      storedEmail = localStorage.getItem(EMAIL_KEY) ?? "";
      storedName = localStorage.getItem(NAME_KEY) ?? "";
      storedNo = localStorage.getItem(NUMBER_KEY) ?? "";
      unlocked = localStorage.getItem(UNLOCK_KEY) !== null;
    } catch {
      /* private mode */
    }
    setEmail(params.get("email") ?? storedEmail);
    setName(storedName);
    setBuilderNumber(storedNo);
    const code = params.get("code") ?? (unlocked ? COUPON_CODE : "");
    setCodeInput(code);
    void applyCode(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyCode = useCallback(async (code: string) => {
    setQuoting(true);
    setCodeError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "quote", code }),
      });
      const q = (await res.json()) as Quote;
      setQuote(q);
      if (code && q.invalidCode) {
        setCodeError("The vault doesn't recognize that code.");
      }
    } catch {
      setQuote({ listAmount: REGULAR_PRICE * 100, discount: 0, amount: REGULAR_PRICE * 100, code: null });
      setCodeError("Couldn't reach the Exchange — the public tuition is shown.");
    } finally {
      setQuoting(false);
    }
  }, []);

  const amount = quote?.amount ?? REGULAR_PRICE * 100;
  const applied = Boolean(quote?.code);

  const options = useMemo(
    () => ({
      mode: "payment" as const,
      amount,
      currency: "usd",
      appearance,
      fonts,
    }),
    [amount]
  );

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <a className={styles.brand} href="/">
          The Mindset Sauce Institute™
        </a>
        <p className="overline">The Exchange — Final Chamber</p>
        <h1 className={styles.title}>
          One identity for <span className="goldWord">another</span>.
        </h1>
      </header>

      <div className={styles.grid}>
        {/* The appraisal — what is being exchanged */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Builder Access</h2>
          <p className={styles.summaryCopy}>
            All six chambers. The Owner&rsquo;s Manual, Workbook, Audio Vault,
            Executables, Transformation Tracker, and every bonus artifact.
          </p>

          <div className={styles.rows}>
            <div className={styles.row}>
              <span>Institute Value</span>
              <span className={styles.mono}>${LEDGER_TOTAL.toLocaleString("en-US")}</span>
            </div>
            <div className={styles.row}>
              <span>Public Tuition</span>
              <span className={`${styles.mono} ${applied ? styles.struck : ""}`}>
                ${REGULAR_PRICE}
              </span>
            </div>
            {applied && (
              <div className={`${styles.row} ${styles.goldRow}`}>
                {/* BUILDER97 carries the house name; any other honored
                    code shows itself with its real discounted price. */}
                <span>
                  {quote?.code === COUPON_CODE
                    ? "Private Builder Tuition™"
                    : `Invitation ${quote?.code} honored`}
                </span>
                <span className={styles.mono}>{fmt(amount)}</span>
              </div>
            )}
            <div className={`${styles.row} ${styles.totalRow}`}>
              <span>Due today</span>
              <span className={styles.mono}>{quoting ? "…" : fmt(amount)}</span>
            </div>
          </div>

          {builderNumber && (
            <p className={styles.builderNo}>
              Builder <span className={styles.mono}>{builderNumber}</span> — your
              enrollment will be recorded under this number.
            </p>
          )}

          <div className={styles.guarantee}>
            <span aria-hidden>◈</span>
            <p>
              <strong>45-Day Builder Guarantee.</strong> Complete the work — if
              it wasn&rsquo;t worth it, one email returns every dollar.
            </p>
          </div>
        </aside>

        {/* The exchange itself */}
        <section className={styles.pay} aria-label="Payment">
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ck-name">Name</label>
            <input
              id="ck-name"
              className={styles.input}
              type="text"
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ck-email">Email — where access arrives</label>
            <input
              id="ck-email"
              className={styles.input}
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ck-code">Builder Invitation Code</label>
            <div className={styles.codeRow}>
              <input
                id="ck-code"
                className={`${styles.input} ${styles.codeInput} ${applied ? styles.codeApplied : ""}`}
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="BUILDER97"
                spellCheck={false}
              />
              <button
                type="button"
                className={styles.applyBtn}
                onClick={() => void applyCode(codeInput)}
                disabled={quoting}
              >
                {applied && codeInput === quote?.code ? "Applied" : "Apply"}
              </button>
            </div>
            {codeError && <p className={styles.error}>{codeError}</p>}
            {applied && (
              <p className={styles.unlocked}>
                {quote?.code === COUPON_CODE
                  ? "Private Builder Tuition™ unlocked"
                  : "Invitation honored"}{" "}
                — ${(quote!.discount / 100).toLocaleString("en-US")} off.
              </p>
            )}
          </div>

          <Elements stripe={stripePromise} options={options}>
            <PayForm
              amount={amount}
              name={name}
              email={email}
              builderNumber={builderNumber}
              code={applied ? quote!.code! : ""}
            />
          </Elements>
        </section>
      </div>
    </main>
  );
}

function PayForm({
  amount,
  name,
  email,
  builderNumber,
  code,
}: {
  amount: number;
  name: string;
  email: string;
  builderNumber: string;
  code: string;
}) {
  const stripeJs = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeJs || !elements || submitting) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("A valid email is required — it is where your access arrives.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const { error: formError } = await elements.submit();
      if (formError) {
        setError(formError.message ?? "Check the payment details.");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "intent", email, name, builderNumber, code }),
      });
      const data = (await res.json()) as { clientSecret?: string; error?: string };
      if (!res.ok || !data.clientSecret) {
        setError(data.error ?? "The Exchange is momentarily unavailable. Nothing was charged.");
        return;
      }

      const { error: confirmError } = await stripeJs.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/welcome`,
          payment_method_data: {
            billing_details: { name: name || undefined, email: email || undefined },
          },
        },
      });
      // Only reached on failure — success navigates to /welcome.
      if (confirmError) {
        setError(confirmError.message ?? "The payment didn't go through. Nothing was charged.");
      }
    } catch {
      setError("The Exchange is momentarily unavailable. Nothing was charged.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={pay} className={styles.payForm}>
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={`btnPrimary ${styles.payBtn}`} type="submit" disabled={submitting || !stripeJs}>
        {submitting ? "Turning the dial…" : `Unlock the Vault — ${fmt(amount)}`}
      </button>
      <p className={styles.fine}>
        Secured by Stripe. Your card details never touch our servers.
      </p>
    </form>
  );
}
