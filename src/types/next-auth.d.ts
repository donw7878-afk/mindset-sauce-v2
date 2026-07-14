import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    builder: {
      id: string;
      email: string;
      name: string;
      builderNumber: string | null;
    };
    user?: DefaultSession["user"];
  }
  interface User {
    builderNumber?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    builderId?: string;
    builderNumber?: string | null;
  }
}
