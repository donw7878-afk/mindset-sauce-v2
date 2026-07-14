import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sessionVaultState } from "@/lib/vault-session";
import { ARCHIVE } from "@/lib/tracks";
import shell from "../Vault.module.css";
import styles from "./Archive.module.css";

export const metadata: Metadata = {
  title: "The Archive — The Mindset Sauce Institute™",
  robots: { index: false },
};

export default async function ArchivePage() {
  const state = await sessionVaultState();
  if (!state) redirect("/login");

  const remaining = 24 - state.totalComplete;

  return (
    <main className={shell.page}>
      <header className={shell.pageHead}>
        <p className="overline">The Archive</p>
        <h1 className={shell.pageTitle}>
          Every artifact, <span className="goldWord">on file</span>.
        </h1>
        <p className={shell.lede}>
          The written instruments of the Institute. Download them, print them,
          write in them — the work only counts in ink.
        </p>
      </header>

      <div className={styles.grid}>
        {ARCHIVE.map((doc) => {
          const isCert = Boolean(doc.certificate);
          const certLocked = isCert && !state.certificateUnlocked;
          const unavailable = !isCert && !doc.file;

          const card = (
            <>
              <div className={styles.cover}>
                <Image src={doc.cover} alt={doc.title} width={480} height={640} />
                {certLocked && (
                  <span className={styles.lockBadge}>
                    {remaining} {remaining === 1 ? "chapter" : "chapters"} remain
                  </span>
                )}
              </div>
              <div className={styles.body}>
                <h2 className={styles.title}>{doc.title}</h2>
                <p className={styles.copy}>{doc.copy}</p>
                <span className={styles.action}>
                  {isCert
                    ? certLocked
                      ? "Sealed until 24 of 24"
                      : "Generate your Certificate →"
                    : unavailable
                      ? "Being engraved — arriving soon"
                      : "Open the PDF →"}
                </span>
              </div>
            </>
          );

          if (isCert) {
            return certLocked ? (
              <div key={doc.slug} className={`${styles.card} ${styles.locked}`}>
                {card}
              </div>
            ) : (
              <Link
                key={doc.slug}
                href="/vault/certificate"
                className={`${styles.card} ${styles.certUnlocked}`}
              >
                {card}
              </Link>
            );
          }
          if (unavailable) {
            return (
              <div key={doc.slug} className={`${styles.card} ${styles.locked}`}>
                {card}
              </div>
            );
          }
          return (
            <a
              key={doc.slug}
              className={styles.card}
              href={`/api/media/pdf/${doc.slug}`}
              target="_blank"
              rel="noopener"
            >
              {card}
            </a>
          );
        })}
      </div>
    </main>
  );
}
