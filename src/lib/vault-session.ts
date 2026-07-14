import { cache } from "react";
import { auth } from "./auth";
import { getBuilderById, getVaultState, type BuilderRecord, type VaultState } from "./vault";

/**
 * Resolves the signed-in Builder for API routes and portal pages.
 * The JWT is necessary but not sufficient — the ledger row must still
 * exist (refunds/removals take effect at the next request).
 *
 * Both helpers are wrapped in React cache() so the vault layout and the
 * page it renders share one set of queries per request.
 */
export const requireBuilder = cache(async (): Promise<BuilderRecord | null> => {
  const session = await auth();
  const id = session?.builder?.id;
  if (!id) return null;
  try {
    return await getBuilderById(id);
  } catch (err) {
    console.error("[vault] builder lookup failed:", err);
    return null;
  }
});

export const sessionVaultState = cache(async (): Promise<VaultState | null> => {
  const builder = await requireBuilder();
  if (!builder) return null;
  return getVaultState(builder);
});
