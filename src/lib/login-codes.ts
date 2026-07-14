import { createHash, randomInt } from "crypto";
import { supabaseAdmin } from "./supabase";
import { getBuilderByEmail, type BuilderRecord } from "./vault";

/**
 * The combination — a six-digit one-time code that opens The Door.
 * Codes live 10 minutes, are single-use, and are stored hashed.
 */

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_CODES_PER_WINDOW = 5;

function hashCode(email: string, code: string): string {
  return createHash("sha256")
    .update(`${email}:${code}:${process.env.AUTH_SECRET ?? ""}`)
    .digest("hex");
}

export type IssueResult =
  | { ok: true; code: string }
  | { ok: false; reason: "unknown" | "throttled" };

/** Issues a code for a Builder on the ledger. Returns the plaintext code
 *  exactly once so the caller can email it — it is never stored. */
export async function issueLoginCode(rawEmail: string): Promise<IssueResult> {
  const email = rawEmail.trim().toLowerCase();
  const builder = await getBuilderByEmail(email);
  if (!builder) return { ok: false, reason: "unknown" };

  const db = supabaseAdmin();
  const windowStart = new Date(Date.now() - CODE_TTL_MS).toISOString();
  const { count } = await db
    .from("login_codes")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", windowStart);
  if ((count ?? 0) >= MAX_CODES_PER_WINDOW) return { ok: false, reason: "throttled" };

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const { error } = await db.from("login_codes").insert({
    email,
    code_hash: hashCode(email, code),
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
  });
  if (error) throw error;
  return { ok: true, code };
}

/** Verifies and consumes a code; returns the Builder when it opens. */
export async function verifyLoginCode(
  rawEmail: string,
  code: string
): Promise<BuilderRecord | null> {
  const email = rawEmail.trim().toLowerCase();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("login_codes")
    .select("id, code_hash")
    .eq("email", email)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(MAX_CODES_PER_WINDOW);
  if (error) throw error;

  const hash = hashCode(email, code);
  const match = (data ?? []).find((row) => row.code_hash === hash);
  if (!match) return null;

  await db
    .from("login_codes")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", match.id);

  return getBuilderByEmail(email);
}
