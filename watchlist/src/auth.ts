import argon2 from "argon2";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";

import { getDrizzleDatabase } from "@/lib/db/drizzle";
import { authSchema } from "@/lib/db/schema/auth";
import { credentialsSchema } from "@/lib/auth/validation";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(getDrizzleDatabase(), authSchema),
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          autocomplete: "email",
        },
        password: {
          label: "Password",
          type: "password",
          autocomplete: "current-password",
        },
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getDrizzleDatabase()
          .select()
          .from(authSchema.usersTable)
          .where(eq(authSchema.usersTable.email, email))
          .get();

        if (!user || user.disabledAt || !user.emailVerified || !user.passwordHash) {
          return null;
        }

        try {
          const passwordMatches = await argon2.verify(user.passwordHash, password);

          if (!passwordMatches) {
            return null;
          }
        } catch {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
