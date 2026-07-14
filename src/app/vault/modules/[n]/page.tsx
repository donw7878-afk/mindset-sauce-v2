import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { sessionVaultState } from "@/lib/vault-session";
import { MODULES, CHAPTERS } from "@/lib/content";
import { archiveDoc } from "@/lib/tracks";
import ChapterPath from "./ChapterPath";
import shell from "../../Vault.module.css";
import styles from "./Chamber.module.css";

export const metadata: Metadata = {
  title: "Module Chamber — The Mindset Sauce Institute™",
  robots: { index: false },
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI"];

export default async function ChamberPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n: raw } = await params;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 6) notFound();

  const state = await sessionVaultState();
  if (!state) redirect("/login");

  const mod = MODULES[n - 1];
  const modState = state.modules[n - 1];

  if (!modState.unlocked) {
    return (
      <main className={shell.page}>
        <div className={styles.sealed}>
          <div className={styles.sealedCover}>
            <Image src={mod.image} alt="" width={640} height={400} />
          </div>
          <p className="overline">Chamber {ROMAN[n]}</p>
          <h1 className={styles.sealedTitle}>This chamber is still sealed.</h1>
          <p className={styles.sealedCopy}>
            The combination only works in sequence. Complete Chamber{" "}
            {ROMAN[n - 1]} — {MODULES[n - 2].title} — and the next number turns
            on its own.
          </p>
          <Link className="btnSecondary" href={`/vault/modules/${n - 1}`}>
            Return to Chamber {ROMAN[n - 1]}
          </Link>
        </div>
      </main>
    );
  }

  const chapters = mod.chapters.map((ch, i) => {
    const c = i + 1;
    const done = modState.completedChapters.includes(c);
    const isNext =
      state.nextChapter?.module === n && state.nextChapter?.chapter === c;
    return {
      chapter: c,
      movement: CHAPTERS[i],
      title: ch.title,
      desc: ch.desc,
      meta: ch.meta,
      done,
      isNext,
      locked: !done && !isNext,
    };
  });

  return (
    <main className={shell.page}>
      <header className={styles.head}>
        <div className={styles.headText}>
          <p className="overline">
            Chamber {ROMAN[n]} · {modState.completedChapters.length} of 4 sealed
          </p>
          <h1 className={styles.title}>{mod.title}</h1>
          <p className={styles.subtitle}>{mod.subtitle}</p>
          <p className={styles.line}>&ldquo;{mod.line}&rdquo;</p>
          <a
            className={styles.moduleDoc}
            href={`/api/media/pdf/module-${n}`}
            target="_blank"
            rel="noopener"
          >
            Open Module PDF &rarr;
          </a>
        </div>
        <div
          className={`${styles.cover} ${modState.complete ? styles.coverSealed : ""}`}
        >
          <Image
            src={mod.image}
            alt={`Module ${n} — ${mod.title}`}
            width={640}
            height={400}
            priority
          />
          {modState.complete && (
            <span className={styles.sealBadge}>Chamber Sealed</span>
          )}
        </div>
      </header>

      <ChapterPath
        module={n}
        moduleTitle={mod.title}
        chapters={chapters}
        workbookAvailable={Boolean(archiveDoc("workbook")?.file)}
        nextModule={n < 6 ? n + 1 : null}
      />
    </main>
  );
}
