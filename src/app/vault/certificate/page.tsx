import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sessionVaultState } from "@/lib/vault-session";
import { supabaseAdmin } from "@/lib/supabase";
import PrintButton from "./PrintButton";
import shell from "../Vault.module.css";
import styles from "./Certificate.module.css";

export const metadata: Metadata = {
  title: "The Certificate — The Mindset Sauce Institute™",
  robots: { index: false },
};

export default async function CertificatePage() {
  const state = await sessionVaultState();
  if (!state) redirect("/login");

  if (!state.certificateUnlocked) {
    const remaining = 24 - state.totalComplete;
    return (
      <main className={shell.page}>
        <div className={styles.lockedWrap}>
          <p className="overline">The Certificate</p>
          <h1 className={styles.lockedTitle}>Earned at completion. Not before.</h1>
          <p className={styles.lockedCopy}>
            {remaining} {remaining === 1 ? "chapter stands" : "chapters stand"}{" "}
            between you and your name on this document. It will be generated
            with your name and Builder Number the moment the last chamber seals.
          </p>
          <Link className="btnPrimary" href={`/vault/modules/${state.currentModule}`}>
            Return to the work
          </Link>
        </div>
      </main>
    );
  }

  const { data } = await supabaseAdmin()
    .from("chapter_progress")
    .select("completed_at")
    .eq("builder_id", state.builder.id)
    .order("completed_at", { ascending: false })
    .limit(1);
  const completedOn = new Date(data?.[0]?.completed_at ?? Date.now()).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <main className={shell.page}>
      <div className={styles.actions}>
        <p className="overline">The Certificate</p>
        <PrintButton />
      </div>

      <div className={styles.certificate} id="certificate">
        <div className={styles.frame}>
          <p className={styles.institute}>The Mindset Sauce Institute&trade;</p>
          <div className={styles.rule} aria-hidden />
          <p className={styles.docType}>Certificate of Completion</p>

          <p className={styles.certifies}>This certifies that</p>
          <p className={styles.name}>{state.builder.name}</p>
          {state.builder.builder_number && (
            <p className={styles.number}>Builder {state.builder.builder_number}</p>
          )}

          <p className={styles.body}>
            has walked all six chambers of the Institute — twenty-four chapters
            of opening, teaching, practice, and close — and completed the full
            combination. Not a spectator of the work, but the person rebuilt by it.
          </p>

          <p className={styles.motto}>
            &ldquo;Build your mind. The results will follow.&rdquo;
          </p>

          <div className={styles.footer}>
            <div className={styles.signBlock}>
              <p className={styles.signName}>Don</p>
              <div className={styles.signRule} aria-hidden />
              <p className={styles.signTitle}>Founder, The Mindset Sauce Institute&trade;</p>
            </div>
            <div className={styles.sealMark} aria-hidden>
              <span className={styles.sealInner}>24 / 24</span>
            </div>
            <div className={styles.signBlock}>
              <p className={styles.signName}>{completedOn}</p>
              <div className={styles.signRule} aria-hidden />
              <p className={styles.signTitle}>Date of completion</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
