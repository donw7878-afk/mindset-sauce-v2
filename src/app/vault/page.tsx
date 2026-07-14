import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { sessionVaultState } from "@/lib/vault-session";
import Greeting from "@/components/vault/Greeting";
import Progress from "@/components/vault/Progress";
import Ring from "@/components/vault/Ring";
import AudioPlayer from "@/components/vault/AudioPlayer";
import ExecutableCard from "@/components/vault/ExecutableCard";
import { ScoreCard, StreakCard } from "@/components/vault/Stats";
import { CHAPTERS } from "@/lib/content";
import shell from "./Vault.module.css";
import styles from "./Dashboard.module.css";

export const metadata: Metadata = {
  title: "The Builder Dashboard — The Mindset Sauce Institute™",
  robots: { index: false },
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI"];

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

export default async function DashboardPage() {
  const state = await sessionVaultState();
  if (!state) redirect("/login");

  const {
    builder,
    mission,
    modules,
    currentModule,
    totalComplete,
    score,
    streak,
    activeToday,
    wins,
    sauceDrop,
    todaysTrack,
    executableDoneToday,
    certificateUnlocked,
  } = state;

  const current = modules.find((m) => m.n === currentModule)!;
  const communityUrl = process.env.NEXT_PUBLIC_COMMUNITY_URL;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const playable = {
    id: todaysTrack.id,
    module: todaysTrack.module,
    chapter: todaysTrack.chapter,
    movement: todaysTrack.movement,
    title: todaysTrack.title,
    moduleTitle: todaysTrack.moduleTitle,
    meta: todaysTrack.meta,
  };

  return (
    <main className={shell.page}>
      <header className={styles.head}>
        <div className={styles.headMeta}>
          <p className="overline">The Builder Dashboard</p>
          {builder.builder_number && (
            <p className={styles.builderNo}>Builder {builder.builder_number}</p>
          )}
        </div>
        <h1 className={styles.greeting}>
          <Greeting name={builder.name} />
        </h1>
        <p className={styles.dateLine}>
          {today} · {totalComplete} of 24 chapters sealed
          {certificateUnlocked && " · Certificate unlocked"}
        </p>
      </header>

      <div className={styles.grid}>
        {/* Today's Mission */}
        <section className={styles.mission} aria-label="Today's Mission">
          <p className={styles.cardLabel}>Today&rsquo;s Mission</p>
          <p className={styles.missionMovement}>
            {mission.maintenance
              ? "All chambers sealed"
              : `Chamber ${ROMAN[mission.module]} — ${mission.movement}`}
          </p>
          <h2 className={styles.missionTitle}>{mission.title}</h2>
          <p className={styles.missionDirective}>{mission.directive}</p>
          <p className={styles.missionMeta}>{mission.meta}</p>
          <Link
            className="btnPrimary"
            href={mission.maintenance ? "/vault/resources" : `/vault/modules/${mission.module}`}
          >
            {mission.maintenance ? "Open the Archive" : `Enter Chamber ${ROMAN[mission.module]}`}
          </Link>
        </section>

        {/* Sauce Drop™ */}
        <aside className={styles.sauce} aria-label="Sauce Drop">
          <p className={styles.cardLabel}>Sauce Drop&trade;</p>
          <p className={styles.sauceLine}>&ldquo;{sauceDrop}&rdquo;</p>
        </aside>

        {/* Current Module */}
        <section className={styles.currentModule} aria-label="Current Module">
          <div className={styles.moduleCover}>
            <Image
              src={current.image}
              alt={`Module ${current.n} — ${current.title}`}
              width={640}
              height={400}
            />
          </div>
          <div className={styles.moduleBody}>
            <p className={styles.cardLabel}>Current Module</p>
            <h2 className={styles.moduleTitle}>
              {ROMAN[current.n]}. {current.title}
            </h2>
            <p className={styles.moduleSubtitle}>{current.subtitle}</p>
            <div className={styles.rings}>
              {[1, 2, 3, 4].map((c) => (
                <Ring
                  key={c}
                  size={20}
                  state={
                    current.completedChapters.includes(c)
                      ? "done"
                      : state.nextChapter?.module === current.n &&
                          state.nextChapter?.chapter === c
                        ? "active"
                        : "open"
                  }
                  title={CHAPTERS[c - 1]}
                />
              ))}
            </div>
            <Link className={`btnSecondary ${styles.continue}`} href={`/vault/modules/${current.n}`}>
              Continue
            </Link>
          </div>
        </section>

        {/* Transformation Progress */}
        <div className={styles.progressCol}>
          <Progress
            totalComplete={totalComplete}
            modules={modules.map((m) => ({
              n: m.n,
              title: m.title,
              done: m.completedChapters.length,
              unlocked: m.unlocked,
            }))}
          />
        </div>

        {/* Builder Score + Streak */}
        <div className={styles.statsCol}>
          <ScoreCard score={score} />
          <StreakCard streak={streak} activeToday={activeToday} />
        </div>

        {/* The six chambers */}
        <section className={styles.rail} aria-label="The Six Chambers">
          <p className={styles.railLabel}>The Six Chambers</p>
          <div className={styles.railGrid}>
            {modules.map((m) => (
              <Link
                key={m.n}
                href={`/vault/modules/${m.n}`}
                className={[
                  styles.railCard,
                  m.current ? styles.railCardCurrent : "",
                  m.unlocked ? "" : styles.railCardLocked,
                ].join(" ")}
                aria-disabled={!m.unlocked}
                tabIndex={m.unlocked ? 0 : -1}
              >
                <div className={styles.railImage}>
                  <Image src={m.image} alt={m.title} width={400} height={250} />
                </div>
                <div className={styles.railMeta}>
                  <span className={styles.railNo}>{String(m.n).padStart(2, "0")}</span>
                  <span className={styles.railState}>
                    {m.complete ? (
                      <Ring state="done" size={18} title="Chamber sealed" />
                    ) : m.unlocked ? (
                      <Ring state={m.current ? "active" : "open"} size={18} title="Open" />
                    ) : (
                      <svg width="14" height="16" viewBox="0 0 14 16" aria-label="Locked">
                        <rect x="1" y="7" width="12" height="8" rx="1.5" fill="none" stroke="#3a3a3a" />
                        <path d="M4 7 V5 a3 3 0 0 1 6 0 V7" fill="none" stroke="#3a3a3a" />
                      </svg>
                    )}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Today's Audio */}
        <section className={styles.audioCard} aria-label="Today's Audio">
          <p className={styles.cardLabel}>Today&rsquo;s Audio</p>
          <AudioPlayer track={playable} />
        </section>

        {/* Today's Executable */}
        <div className={styles.executable}>
          <ExecutableCard done={executableDoneToday} />
        </div>

        {/* Recent Wins */}
        <section className={styles.wins} aria-label="Recent Wins">
          <p className={styles.cardLabel}>Recent Wins</p>
          {wins.length === 0 ? (
            <p className={styles.winsEmpty}>
              The ledger is waiting for its first entry. Seal a chapter or run
              today&rsquo;s Executable — everything you finish is recorded here.
            </p>
          ) : (
            <ul className={styles.winsList}>
              {wins.map((w, i) => (
                <li key={i} className={styles.winRow}>
                  <span className={styles.winDot} aria-hidden />
                  {w.label}
                  <span className={styles.winTime}>{relativeTime(w.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Builder Community */}
        <a
          className={styles.community}
          href={communityUrl || "#"}
          target={communityUrl ? "_blank" : undefined}
          rel={communityUrl ? "noopener" : undefined}
          aria-disabled={!communityUrl}
        >
          <p className={styles.cardLabel}>The Builder Community</p>
          <h2 className={styles.communityTitle}>Builders don&rsquo;t build alone.</h2>
          <p className={styles.communityCopy}>
            {communityUrl
              ? "The mastermind and the environment — Module Six, made permanent. Step in."
              : "The doors are being fitted. Your Builder Number already has a seat reserved."}
          </p>
          <span className="btnGhost">
            {communityUrl ? "Enter the Community →" : "Opening soon"}
          </span>
        </a>
      </div>
    </main>
  );
}
