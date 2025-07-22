import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
  ipData,
} from "./db/schema";
import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { IpLocationResponse } from "@/global";

const sql =
  global.db ??
  postgres(process.env.DATABASE_URL!, {
    max: 1,
    ssl: "require",
  });

global.db ??= drizzle(sql as unknown as postgres.Sql<Record<string, unknown>>);

global.ipRequests = new Map();

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    session: async ({ session, user }) => {
      const heads = await headers();
      const ip = ("136.33.255.145" || heads.get("x-ip")) ?? "<unknown>";
      let ipInfo = global.ipRequests.get(ip);

      if (!ip) {
        return {
          sessionToken: undefined,
          session: undefined,
          user: undefined,
          expires: new Date().toString(),
          authorized: false,
        };
      }

      const ua = heads.get("x-ua")?.substring(0, 128) ?? "<unknown>";

      const db = global.db as PostgresJsDatabase<Record<string, never>> & {
        $client: postgres.Sql<Record<string, never>>;
      };

      if (ipInfo == undefined) {
        const dbReq = await db
          .select()
          .from(ipData)
          .where(eq(ipData.ip, ip))
          .limit(1);

        if (dbReq.length != 0) {
          ipInfo = dbReq?.at(0) as IpLocationResponse | undefined;
        } else {
          global.ipRequests.set(ip, null);
          const response = await fetch(`http://ip-api.com/json/${ip}`);
          ipInfo = (await response.json()) as IpLocationResponse;
          global.ipRequests.set(ip, ipInfo);
          await db
            .insert(ipData)
            .values({
              ip,
              data: JSON.stringify(ipInfo),
            })
            .onConflictDoUpdate({
              target: [ipData.ip],
              set: {
                data: JSON.stringify(ipInfo),
              },
            });
        }
      }

      const row = (
        await db
          .select()
          .from(sessions)
          .where(eq(sessions.sessionToken, session.sessionToken))
          .limit(1)
      )?.at(0);

      if (!row) {
        return {
          sessionToken: undefined,
          session: undefined,
          user: undefined,
          expires: new Date().toString(),
          authorized: false,
        };
      }

      const DAY = 1000 * 60 * 60 * 24;
      const DAYS = DAY * 7;

      if (row.expires.getTime() + DAYS > Date.now()) {
        await db
          .update(sessions)
          .set({
            expires: new Date(Date.now() + DAYS),
          })
          .where(eq(sessions.sessionToken, session.sessionToken));
      }

      const shouldUpdate =
        row.ip != ip ||
        row.userAgent != ua ||
        row.country != ipInfo?.country ||
        row.region != ipInfo?.region ||
        row.city != ipInfo?.city;

      if (shouldUpdate) {
        await db
          .update(sessions)
          .set({
            ip,
            userAgent: ua,
            country: ipInfo?.country,
            region: ipInfo?.region,
            city: ipInfo?.city,
          })
          .where(eq(sessions.sessionToken, session.sessionToken));
      }

      if (
        (row.userAgent ?? ua) != ua ||
        (row.country ?? ipInfo?.country) != ipInfo?.country ||
        (row.region ?? ipInfo?.region) != ipInfo?.region
      ) {
        console.warn("Session data mismatch detected", {
          sessionToken: session.sessionToken,
          server: {
            ip: row.ip,
            userAgent: row.userAgent,
            country: row.country,
            region: row.region,
            city: row.city,
          },
          request: {
            ip,
            userAgent: ua,
            country: ipInfo?.country,
            region: ipInfo?.region,
            city: ipInfo?.city,
          },
        });
        return {
          sessionToken: undefined,
          session: undefined,
          user: undefined,
          expires: new Date().toString(),
          authorized: false,
        };
      }

      await db
        .update(sessions)
        .set({
          lastAccessed: new Date(),
        })
        .where(eq(sessions.sessionToken, session.sessionToken));

      return {
        ...session,
        authorized: true,
        user: {
          ...session.user,
          id: user?.id ?? "",
        },
      };
    },
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
