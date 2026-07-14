#!/usr/bin/env node
/**
 * Uploads the Audio Vault (24 mp3s) and Archive PDFs from assets/ into
 * private Supabase Storage buckets. Run once per environment:
 *
 *   node scripts/upload-media.mjs
 *
 * The media routes prefer signed Storage URLs and fall back to local
 * streaming, so the portal works before AND after this runs.
 */
import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "fs/promises";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");

// Minimal .env.local loader — no dotenv dependency.
const env = { ...process.env };
try {
  for (const line of (await readFile(path.join(root, ".env.local"), "utf8")).split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !(m[1] in process.env)) env[m[1]] = m[2];
  }
} catch {
  /* rely on process.env */
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

async function ensureBucket(name) {
  const { error } = await db.storage.createBucket(name, { public: false });
  if (error && !/already exists/i.test(error.message)) throw error;
  console.log(`bucket ${name} ready`);
}

async function upload(bucket, object, filePath, contentType) {
  const body = await readFile(filePath);
  const { error } = await db.storage
    .from(bucket)
    .upload(object, body, { contentType, upsert: true });
  if (error) throw new Error(`${bucket}/${object}: ${error.message}`);
  console.log(`  ↑ ${bucket}/${object}  (${(body.length / 1024 / 1024).toFixed(1)} MB)`);
}

await ensureBucket("audio-vault");
await ensureBucket("archive");

// Audio: classify each module folder's files by movement keyword.
const audioRoot = path.join(root, "assets/audio-vault");
const movementOf = (f) => {
  const s = f.toUpperCase();
  if (s.includes("OPENING")) return 1;
  if (s.includes("CORE")) return 2;
  if (s.includes("PRACTICE")) return 3;
  if (s.includes("CLOSE")) return 4;
  return null;
};

for (const dir of (await readdir(audioRoot, { withFileTypes: true })).filter((d) => d.isDirectory())) {
  const m = dir.name.match(/MODULE\s+(\d)/i);
  if (!m) continue;
  const mod = Number(m[1]);
  const files = (await readdir(path.join(audioRoot, dir.name))).filter((f) =>
    f.toLowerCase().endsWith(".mp3")
  );
  for (const f of files) {
    const chapter = movementOf(f);
    if (!chapter) {
      console.warn(`  ? unclassified: ${dir.name}/${f}`);
      continue;
    }
    await upload(
      "audio-vault",
      `m${mod}c${chapter}.mp3`,
      path.join(audioRoot, dir.name, f),
      "audio/mpeg"
    );
  }
}

// Archive PDFs — keep in sync with ARCHIVE in src/lib/tracks.ts.
const pdfs = [
  ["owners-manual.pdf", "assets/owners-manual/owners-manual-cover.pdf"],
  ["workbook.pdf", "assets/workbook/The Workbook - COMPLETE.pdf"],
  ["tracker.pdf", "assets/tracker/transformation-tracker.pdf"],
  ["executables.pdf", "assets/executables/Daily Executables - COMPLETE.pdf"],
  ["emergency-cards.pdf", "assets/bonus/emergency-cards/Emergency- Cards.pdf"],
  ["declaration.pdf", "assets/bonus/declaration/declaration.pdf"],
  ["clear-cache.pdf", "assets/bonus/clear-cache/clear-the cache.pdf"],
  ["certificate.pdf", "assets/bonus/certificate/Certificate.pdf"],
  ["module-1.pdf", "assets/modules/module1/Mindset Secret Sauce Module 1 with Cover Art attached - 18 Pgs.pdf"],
  ["module-2.pdf", "assets/modules/module2/Mindset Secret Sauce Module 2 with Cover Art Attached.pdf"],
  ["module-3.pdf", "assets/modules/module3/Mindset Secret Sauce Module 3 with Cover Art Attached.pdf"],
  ["module-4.pdf", "assets/modules/module4/Mindset Secret Sauce Module 4 with Cover Art Attached.pdf"],
  ["module-5.pdf", "assets/modules/module5/Mindset Secret Sauce Module 5 with Cover Art Attached.pdf"],
  ["module-6.pdf", "assets/modules/module6/Mindset Secret Sauce Module 6 with Cover Art Attached.pdf"],
];
for (const [object, rel] of pdfs) {
  try {
    await upload("archive", object, path.join(root, rel), "application/pdf");
  } catch (err) {
    console.warn(`  ! skipped ${object}: ${err.message}`);
  }
}

console.log("done.");
