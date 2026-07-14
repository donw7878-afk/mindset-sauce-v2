import { supabaseAdmin } from "./supabase";
import { MODULES, CHAPTERS } from "./content";
import { trackFor, type Track } from "./tracks";
import { sauceDropFor } from "./sauce-drops";

/**
 * The vault data layer. Everything the Builder Portal knows about a
 * Builder — progress, score, streak, mission — is computed here from
 * five Supabase tables. All functions are server-only (service role).
 *
 * Builder Score (documented so the number is never mysterious):
 *   +50  per chapter sealed          (24 chapters   → 1,200)
 *   +100 per chamber sealed          (6 modules     →   600)
 *   +10  per active day
 *   +70  streak of 7+ days, +300 streak of 30+ days
 */

export interface BuilderRecord {
  id: string;
  email: string;
  name: string;
  builder_number: string | null;
  purchased_at: string;
}

export interface Win {
  kind: string;
  label: string;
  created_at: string;
}

export interface ModuleState {
  n: number;
  title: string;
  subtitle: string;
  image: string;
  completedChapters: number[]; // chapter numbers 1–4
  complete: boolean;
  unlocked: boolean;
  current: boolean;
}

export interface Mission {
  module: number;
  chapter: number;
  movement: string; // "I. Opening"
  title: string;
  meta: string;
  directive: string;
  /** True once all 24 chapters are sealed. */
  maintenance: boolean;
}

export interface VaultState {
  builder: BuilderRecord;
  modules: ModuleState[];
  completed: Set<string>; // "m1c1"
  totalComplete: number; // 0–24
  currentModule: number; // 1–6 (highest unlocked, or 6 when done)
  nextChapter: { module: number; chapter: number } | null;
  score: number;
  streak: number;
  activeDays: number;
  activeToday: boolean;
  wins: Win[];
  executableDoneToday: boolean;
  positions: Record<string, { seconds: number; duration: number | null }>;
  mission: Mission;
  sauceDrop: string;
  todaysTrack: Track;
  certificateUnlocked: boolean;
}

const key = (m: number, c: number) => `m${m}c${c}`;

/* ============ Builders ============ */

export async function getBuilderByEmail(email: string): Promise<BuilderRecord | null> {
  const { data, error } = await supabaseAdmin()
    .from("builders")
    .select("id, email, name, builder_number, purchased_at")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getBuilderById(id: string): Promise<BuilderRecord | null> {
  const { data, error } = await supabaseAdmin()
    .from("builders")
    .select("id, email, name, builder_number, purchased_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/* ============ Streak ============ */

const dayString = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Consecutive active days ending today or yesterday — a streak survives
 * until a full day is missed, so it doesn't read 0 at breakfast.
 */
export function computeStreak(days: Set<string>, now = new Date()): number {
  const cursor = new Date(now);
  if (!days.has(dayString(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (days.has(dayString(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function computeScore(opts: {
  chapters: number;
  modules: number;
  activeDays: number;
  streak: number;
}): number {
  return (
    opts.chapters * 50 +
    opts.modules * 100 +
    opts.activeDays * 10 +
    (opts.streak >= 7 ? 70 : 0) +
    (opts.streak >= 30 ? 300 : 0)
  );
}

/* ============ Mission ============ */

const DIRECTIVES: Record<number, string> = {
  1: "Enter the chamber. Listen once, all the way through — no notes yet.",
  2: "The principle installs by attention. Listen, then write one line in the Workbook.",
  3: "Audio and Workbook together, ink required. Then run today's Executable.",
  4: "Lock it in. Complete The Close and the chamber seals behind you.",
};

function missionFor(next: { module: number; chapter: number } | null): Mission {
  if (!next) {
    return {
      module: 6,
      chapter: 4,
      movement: "The Practice continues",
      title: "Maintenance",
      meta: "Daily • Executable + Tracker",
      directive:
        "All 24 chapters are sealed. Run today's Executable, mark the Tracker, and revisit the chamber that built you most.",
      maintenance: true,
    };
  }
  const mod = MODULES[next.module - 1];
  const ch = mod.chapters[next.chapter - 1];
  return {
    module: next.module,
    chapter: next.chapter,
    movement: CHAPTERS[next.chapter - 1],
    title: ch.title,
    meta: ch.meta,
    directive: DIRECTIVES[next.chapter],
    maintenance: false,
  };
}

/* ============ The full dashboard state ============ */

export async function getVaultState(builder: BuilderRecord): Promise<VaultState> {
  const db = supabaseAdmin();
  const today = dayString(new Date());
  const [progressRes, daysRes, winsRes, posRes, execRes] = await Promise.all([
    db.from("chapter_progress").select("module, chapter").eq("builder_id", builder.id),
    db.from("activity_days").select("day").eq("builder_id", builder.id),
    db
      .from("wins")
      .select("kind, label, created_at")
      .eq("builder_id", builder.id)
      .order("created_at", { ascending: false })
      .limit(6),
    db
      .from("audio_positions")
      .select("track_id, seconds, duration")
      .eq("builder_id", builder.id),
    db
      .from("wins")
      .select("id", { count: "exact", head: true })
      .eq("builder_id", builder.id)
      .eq("kind", "executable")
      .gte("created_at", `${today}T00:00:00Z`),
  ]);
  for (const r of [progressRes, daysRes, winsRes, posRes]) {
    if (r.error) throw r.error;
  }

  const completed = new Set<string>(
    (progressRes.data ?? []).map((r) => key(r.module, r.chapter))
  );
  const days = new Set<string>((daysRes.data ?? []).map((r) => r.day));
  const positions: VaultState["positions"] = {};
  for (const r of posRes.data ?? []) {
    positions[r.track_id] = { seconds: r.seconds, duration: r.duration };
  }

  // Sequential unlock: module n opens when module n-1 is fully sealed.
  let unlockedThrough = 1;
  for (let m = 1; m <= 5; m++) {
    const complete = [1, 2, 3, 4].every((c) => completed.has(key(m, c)));
    if (complete) unlockedThrough = m + 1;
    else break;
  }

  const modules: ModuleState[] = MODULES.map((mod) => {
    const chapters = [1, 2, 3, 4].filter((c) => completed.has(key(mod.n, c)));
    const complete = chapters.length === 4;
    return {
      n: mod.n,
      title: mod.title,
      subtitle: mod.subtitle,
      image: mod.image,
      completedChapters: chapters,
      complete,
      unlocked: mod.n <= unlockedThrough,
      current: false,
    };
  });
  const current = modules.find((m) => m.unlocked && !m.complete) ?? modules[5];
  current.current = true;

  // Next chapter in the ritual order.
  let nextChapter: { module: number; chapter: number } | null = null;
  outer: for (const m of modules) {
    if (!m.unlocked) break;
    for (let c = 1; c <= 4; c++) {
      if (!completed.has(key(m.n, c))) {
        nextChapter = { module: m.n, chapter: c };
        break outer;
      }
    }
  }

  const streak = computeStreak(days);
  const totalComplete = completed.size;
  const modulesComplete = modules.filter((m) => m.complete).length;
  const score = computeScore({
    chapters: totalComplete,
    modules: modulesComplete,
    activeDays: days.size,
    streak,
  });

  const mission = missionFor(nextChapter);
  const todaysTrack = trackFor(mission.module, mission.chapter)!;

  return {
    builder,
    modules,
    completed,
    totalComplete,
    currentModule: current.n,
    nextChapter,
    score,
    streak,
    activeDays: days.size,
    activeToday: days.has(today),
    wins: winsRes.data ?? [],
    executableDoneToday: (execRes.count ?? 0) > 0,
    positions,
    mission,
    sauceDrop: sauceDropFor(),
    todaysTrack,
    certificateUnlocked: totalComplete === 24,
  };
}

/* ============ Writes ============ */

async function addWin(builderId: string, kind: string, label: string) {
  await supabaseAdmin().from("wins").insert({ builder_id: builderId, kind, label });
}

/** Marks today active and awards streak-milestone wins exactly once. */
export async function touchActivity(builderId: string): Promise<void> {
  const db = supabaseAdmin();
  const today = dayString(new Date());
  const { error, data } = await db
    .from("activity_days")
    .upsert({ builder_id: builderId, day: today }, { onConflict: "builder_id,day", ignoreDuplicates: true })
    .select();
  if (error) throw error;

  // Only when today was newly recorded — milestones fire once per streak.
  if ((data ?? []).length > 0) {
    const { data: allDays } = await db
      .from("activity_days")
      .select("day")
      .eq("builder_id", builderId);
    const streak = computeStreak(new Set((allDays ?? []).map((r) => r.day)));
    if (streak === 7) await addWin(builderId, "streak", "Seven-day Builder Streak — the flame is lit");
    if (streak === 30) await addWin(builderId, "streak", "Thirty days unbroken — climate, not weather");
  }
}

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI"];

export interface CompleteResult {
  ok: boolean;
  error?: string;
  moduleSealed?: boolean;
  certificateUnlocked?: boolean;
}

/**
 * Seals a chapter. Enforces the ritual order server-side: the chapter
 * must be the next unsealed one in an unlocked module.
 */
export async function recordChapterComplete(
  builder: BuilderRecord,
  module: number,
  chapter: number
): Promise<CompleteResult> {
  if (module < 1 || module > 6 || chapter < 1 || chapter > 4) {
    return { ok: false, error: "invalid chapter" };
  }
  const state = await getVaultState(builder);
  if (state.completed.has(key(module, chapter))) {
    return { ok: true, moduleSealed: false }; // already sealed — idempotent
  }
  if (!state.nextChapter || state.nextChapter.module !== module || state.nextChapter.chapter !== chapter) {
    return { ok: false, error: "The path is sequential — this chapter is not next." };
  }

  const db = supabaseAdmin();
  const { error } = await db
    .from("chapter_progress")
    .insert({ builder_id: builder.id, module, chapter });
  if (error && error.code !== "23505") throw error;

  const mod = MODULES[module - 1];
  const chTitle = mod.chapters[chapter - 1].title;
  await addWin(builder.id, "chapter", `Sealed ${CHAPTERS[chapter - 1]} — “${chTitle}”`);

  const moduleSealed = chapter === 4;
  if (moduleSealed) {
    await addWin(
      builder.id,
      "module",
      `Chamber ${ROMAN[module]} sealed — ${mod.title} is yours`
    );
  }
  const certificateUnlocked = state.totalComplete + 1 === 24;
  if (certificateUnlocked) {
    await addWin(builder.id, "certificate", "24 of 24 — the Certificate has unlocked");
  }
  await touchActivity(builder.id);
  return { ok: true, moduleSealed, certificateUnlocked };
}

/** Persists playback position; ≥30s of listening marks the day active. */
export async function saveAudioPosition(
  builderId: string,
  trackId: string,
  seconds: number,
  duration?: number
): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db.from("audio_positions").upsert(
    {
      builder_id: builderId,
      track_id: trackId,
      seconds: Math.max(0, seconds),
      duration: duration ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "builder_id,track_id" }
  );
  if (error) throw error;
  if (seconds >= 30) await touchActivity(builderId);
}

/** Today's Executable check-in — one win per day, marks the day active. */
export async function checkinExecutable(builder: BuilderRecord): Promise<void> {
  const db = supabaseAdmin();
  const today = dayString(new Date());
  const { data } = await db
    .from("wins")
    .select("id")
    .eq("builder_id", builder.id)
    .eq("kind", "executable")
    .gte("created_at", `${today}T00:00:00Z`)
    .limit(1);
  if ((data ?? []).length === 0) {
    await addWin(builder.id, "executable", "Ran today's Executable — a promise kept");
  }
  await touchActivity(builder.id);
}
