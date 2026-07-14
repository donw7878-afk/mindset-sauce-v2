import { MODULES, CHAPTERS } from "./content";

/**
 * The media catalog — maps every Audio Vault track and Archive PDF to its
 * asset on disk (assets/, dev) and its object in Supabase Storage
 * (production, uploaded by scripts/upload-media.mjs). Track ids are
 * `m{module}c{chapter}`, e.g. "m3c2" = Module 3, The Core Teaching.
 */

export type TrackId = string;

export interface Track {
  id: TrackId;
  module: number; // 1–6
  chapter: number; // 1–4
  /** e.g. "II. The Core Teaching" */
  movement: string;
  /** Chapter title from the module artwork, e.g. "The Soil Determines the Harvest" */
  title: string;
  /** Module title, e.g. "The Soil" */
  moduleTitle: string;
  meta: string;
  /** Path relative to the repo root (dev streaming). */
  file: string;
  /** Object key inside the `audio-vault` storage bucket. */
  object: string;
}

/** Audio filenames as they exist in assets/audio-vault — including the
 *  typos and stray spaces. Do not "fix" these; they must match disk. */
const AUDIO_FILES: Record<number, { dir: string; files: [string, string, string, string] }> = {
  1: {
    dir: "MODULE 1 - AUDIO",
    files: [
      "Mindset - Mod1 Audio - OPENING.mp3",
      "Mindset - Audio Mod1 - THE CORE TEACHING.mp3",
      "MIndset Audio - Mod1 THE PRACTICE.mp3",
      "Mindset Audio - Mod1 THE CLOSE.mp3",
    ],
  },
  2: {
    dir: "MODULE 2 - AUDIO",
    files: [
      "Mindset - Mod2 Audio - OPENING.mp3",
      "Mindset - Mod2 Audio - THE CORE TEACHING.mp3",
      "Mindset - Mod2 Audio - THE PRACTICE.mp3",
      "Mindset - Mod2 Audio - THE CLOSE.mp3",
    ],
  },
  3: {
    dir: "MODULE 3 - AUDIO",
    files: [
      "Mindset - Mod3 Audio - OPENING.mp3",
      "Mindset - Mod3 Audio - THE CORE TEACHING.mp3",
      "Mindset - Mod3 Audio - THE PRACTICEmp3.mp3",
      "Mindset - Mod3 Audio - THE CLOSE.mp3",
    ],
  },
  4: {
    dir: "MODULE 4 - AUDIO",
    files: [
      "Mindset - Mod4 Audio - OPENING.mp3",
      "Mindset - Mod4 Audio - THE CORE TEACHING.mp3",
      "Mindset - Mod4 Audio - THE PRACTICE.mp3",
      "Mindset - Mod4 Audio - THE CLOSE.mp3",
    ],
  },
  5: {
    dir: "MODULE 5 - AUDIO",
    files: [
      "Mindset - Mod5 Audio - OPENING.mp3",
      "Mindset - Mod5 Audio - THE CORE TEACHING.mp3",
      "Mindset - Mod5 Audio - THE PRACTICE.mp3",
      "Mindset - Mod5 Audio - THE CLOSE.mp3",
    ],
  },
  6: {
    dir: "MODULE 6 - AUDIO ", // trailing space is real
    files: [
      "Mindset - Mod6 Audio - OPENING.mp3",
      "Mindset - Mod6 Audio - THE CORE TEACHING.mp3",
      "Mindset - Mod6 Audio - THE PRACTICE .mp3",
      "Mindset - Mod6 Audio - THE CLOSE - FINAL WORD.mp3",
    ],
  },
};

export const TRACKS: Track[] = MODULES.flatMap((mod) =>
  mod.chapters.map((ch, i) => ({
    id: `m${mod.n}c${i + 1}`,
    module: mod.n,
    chapter: i + 1,
    movement: CHAPTERS[i],
    title: ch.title,
    moduleTitle: mod.title,
    meta: ch.meta,
    file: `assets/audio-vault/${AUDIO_FILES[mod.n].dir}/${AUDIO_FILES[mod.n].files[i]}`,
    object: `m${mod.n}c${i + 1}.mp3`,
  }))
);

export function trackById(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}

export function trackFor(module: number, chapter: number): Track | undefined {
  return trackById(`m${module}c${chapter}`);
}

/* ============ The Archive — every PDF in the vault ============ */

export interface ArchiveDoc {
  slug: string;
  title: string;
  copy: string;
  cover: string;
  /** Path relative to repo root; null = not yet uploaded to assets/. */
  file: string | null;
  /** Object key inside the `archive` storage bucket. */
  object: string;
  /** Locked until 24/24 — the Certificate. */
  certificate?: boolean;
}

export const ARCHIVE: ArchiveDoc[] = [
  {
    slug: "owners-manual",
    title: "The Owner's Manual",
    copy: "Read first, kept forever. How to run the system — and yourself — for life.",
    cover: "/images/artifacts/owners-manual.png",
    file: "assets/owners-manual/owners-manual-cover.pdf",
    object: "owners-manual.pdf",
  },
  {
    slug: "workbook",
    title: "The Workbook",
    copy: "Where the teaching becomes handwriting, and handwriting becomes identity.",
    cover: "/images/workbook.png",
    file: "assets/workbook/The Workbook - COMPLETE.pdf",
    object: "workbook.pdf",
  },
  {
    slug: "tracker",
    title: "The Transformation Tracker",
    copy: "Your progress, made visible. Mark it daily.",
    cover: "/images/artifacts/tracker.png",
    file: "assets/tracker/transformation-tracker.pdf",
    object: "tracker.pdf",
  },
  {
    slug: "executables",
    title: "Daily Executables",
    copy: "The day's non-negotiables, distilled to one page.",
    cover: "/images/artifacts/executables.png",
    file: "assets/executables/Daily Executables - COMPLETE.pdf",
    object: "executables.pdf",
  },
  {
    slug: "emergency-cards",
    title: "The Emergency Cards",
    copy: "For the moments the old mind comes back loud.",
    cover: "/images/artifacts/emergency-cards.png",
    file: "assets/bonus/emergency-cards/Emergency- Cards.pdf",
    object: "emergency-cards.pdf",
  },
  {
    slug: "declaration",
    title: "The Declaration",
    copy: "Signed once. Binding forever.",
    cover: "/images/artifacts/declaration.png",
    file: "assets/bonus/declaration/declaration.pdf",
    object: "declaration.pdf",
  },
  {
    slug: "clear-cache",
    title: "Clear the Cache",
    copy: "The evening reset protocol for a crowded mind.",
    cover: "/images/artifacts/clear-cache.png",
    file: "assets/bonus/clear-cache/clear-the cache.pdf",
    object: "clear-cache.pdf",
  },
  {
    slug: "certificate",
    title: "The Certificate",
    copy: "Earned at 24 of 24. Generated with your name and Builder Number.",
    cover: "/images/artifacts/certificate.png",
    file: "assets/bonus/certificate/Certificate.pdf",
    object: "certificate.pdf",
    certificate: true,
  },
];

/* ============ The written modules — one PDF per chamber ============ */

/** Module PDF filenames as they exist in assets/modules — must match disk. */
const MODULE_PDF_FILES: Record<number, string> = {
  1: "assets/modules/module1/Mindset Secret Sauce Module 1 with Cover Art attached - 18 Pgs.pdf",
  2: "assets/modules/module2/Mindset Secret Sauce Module 2 with Cover Art Attached.pdf",
  3: "assets/modules/module3/Mindset Secret Sauce Module 3 with Cover Art Attached.pdf",
  4: "assets/modules/module4/Mindset Secret Sauce Module 4 with Cover Art Attached.pdf",
  5: "assets/modules/module5/Mindset Secret Sauce Module 5 with Cover Art Attached.pdf",
  6: "assets/modules/module6/Mindset Secret Sauce Module 6 with Cover Art Attached.pdf",
};

/** Linked from each chamber page — not shown in the Archive grid. */
export const MODULE_DOCS: ArchiveDoc[] = MODULES.map((mod) => ({
  slug: `module-${mod.n}`,
  title: `Module ${mod.n} — ${mod.title}`,
  copy: mod.subtitle,
  cover: mod.image,
  file: MODULE_PDF_FILES[mod.n],
  object: `module-${mod.n}.pdf`,
}));

export function archiveDoc(slug: string): ArchiveDoc | undefined {
  return (
    ARCHIVE.find((d) => d.slug === slug) ??
    MODULE_DOCS.find((d) => d.slug === slug)
  );
}
