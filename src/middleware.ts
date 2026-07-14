import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Gates the Builder Portal. API routes under /api/vault and /api/media
 * check the session themselves (they must answer 401, not redirect).
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/vault/:path*", "/vault"],
};
