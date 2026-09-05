import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { getDrizzleDatabase } from "@/lib/db/drizzle";
import { authSchema } from "@/lib/db/schema/auth";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(getDrizzleDatabase(), authSchema),
  providers: [],
  session: {
    strategy: "jwt",
  },
});
