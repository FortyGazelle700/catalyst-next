import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import { accounts, sessions, users, verificationTokens } from "./db/schema";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const sql =
  global.db ??
  postgres(process.env.DATABASE_URL!, {
    max: 1,
    ssl: "require",
  });

if (!global.db) global.db = drizzle(sql as unknown as postgres.Sql<{}>);

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user?.id ?? "",
      },
    }),
  },
  adapter: DrizzleAdapter(global.db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET,
  redirectProxyUrl: process.env.PUBLISH_URL,
});
