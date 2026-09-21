import argon2 from "argon2";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";

import { getDrizzleDatabase } from "@/lib/db/drizzle";
import { authSchema } from "@/lib/db/schema/auth";
import { credentialsSchema } from "@/lib/auth/validation";
import {
  checkLoginAllowed,
  recordLoginFailure,
  recordLoginRateLimited,
  recordLoginSuccess,
  recordLoginVerificationError,
  type LoginAttemptContext,
} from "@/lib/auth/loginSecurity";

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
      async authorize(credentials, request) {
        const email = typeof credentials?.email === "string" ? credentials.email : "";
        const forwardedFor = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();

        const context: LoginAttemptContext = {
          email,
          ipAddress: request.headers.get("x-real-ip") ?? forwardedFor,
          userAgent: request.headers.get("user-agent"),
        };

        const loginDecision = await checkLoginAllowed(context);
        if (!loginDecision.allowed) {
          recordLoginRateLimited(context, loginDecision.reason ?? "rate_limited");
          return null;
        }

        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          await recordLoginFailure(context, "invalid_credentials");
          return null;
        }

        const { email: normalizedEmail, password } = parsedCredentials.data;
        const user = await getDrizzleDatabase()
          .select()
          .from(authSchema.usersTable)
          .where(eq(authSchema.usersTable.email, normalizedEmail))
          .get();

        if (!user || user.disabledAt || !user.emailVerified || !user.passwordHash) {
          await recordLoginFailure({ ...context, email: normalizedEmail, userId: user?.id }, "invalid_credentials");
          return null;
        }

        try {
          const passwordMatches = await argon2.verify(user.passwordHash, password);

          if (!passwordMatches) {
            await recordLoginFailure({ ...context, email: normalizedEmail, userId: user.id }, "invalid_credentials");
            return null;
          }
        } catch {
          recordLoginVerificationError({ ...context, email: normalizedEmail, userId: user.id });
          return null;
        }

        await recordLoginSuccess({ ...context, email: normalizedEmail, userId: user.id });

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
