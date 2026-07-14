import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service-role key. RLS is enabled
 * on every table with no anon policies, so this client is the only way
 * in — the browser never talks to Supabase directly.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseConfigured = Boolean(url && serviceKey);

let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (!supabaseConfigured) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
