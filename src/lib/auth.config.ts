import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the NextAuth config — no Node-only imports, so the
 * middleware can gate /vault/* without pulling in Supabase or Resend.
 * The Credentials provider lives in auth.ts.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    authorized({ auth, request }) {
      if (request.nextUrl.pathname.startsWith("/vault")) return !!auth?.user;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.builderId = user.id;
        token.builderNumber = user.builderNumber ?? null;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      session.builder = {
        id: (token.builderId as string) ?? "",
        email: token.email ?? "",
        name: token.name ?? "Builder",
        builderNumber: (token.builderNumber as string | null) ?? null,
      };
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
