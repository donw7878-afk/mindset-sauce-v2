import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { verifyLoginCode } from "./login-codes";

/**
 * The Door. Builders sign in with their email and a six-digit
 * combination sent from vault@ — no passwords to forget, and only
 * addresses on the builders ledger can ever get a code.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "combination",
      name: "Combination",
      credentials: { email: {}, code: {} },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const code = String(credentials?.code ?? "").replace(/\s/g, "");
        if (!email || !/^\d{6}$/.test(code)) return null;
        try {
          const builder = await verifyLoginCode(email, code);
          if (!builder) return null;
          return {
            id: builder.id,
            email: builder.email,
            name: builder.name,
            builderNumber: builder.builder_number,
          };
        } catch (err) {
          console.error("[auth] combination verify failed:", err);
          return null;
        }
      },
    }),
  ],
});
