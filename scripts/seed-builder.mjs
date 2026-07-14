#!/usr/bin/env node
/**
 * Puts a Builder on the ledger by hand — for testing The Door and the
 * dashboard without a Stripe purchase:
 *
 *   node scripts/seed-builder.mjs you@example.com "Your Name"
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const env = { ...process.env };
try {
  for (const line of (await readFile(path.join(root, ".env.local"), "utf8")).split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !(m[1] in process.env)) env[m[1]] = m[2];
  }
} catch {
  /* rely on process.env */
}

const [email, name = "Builder"] = process.argv.slice(2);
if (!email) {
  console.error("usage: node scripts/seed-builder.mjs <email> [name]");
  process.exit(1);
}

// Same deterministic Builder Number™ as src/lib/content.ts.
let h = 0;
for (const c of email.toLowerCase().trim()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
const builderNumber = `#${String(1000 + (h % 9000)).padStart(6, "0")}`;

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { error } = await db.from("builders").upsert(
  {
    email: email.toLowerCase().trim(),
    name,
    builder_number: builderNumber,
    product: "seed",
    coupon: null,
    livemode: false,
  },
  { onConflict: "email" }
);
if (error) {
  console.error("seed failed:", error.message);
  process.exit(1);
}
console.log(`Builder on the ledger: ${email} (${builderNumber})`);
