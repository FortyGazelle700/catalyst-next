"use server";

import { after } from "next/server";

import { canvas } from "./canvas";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { auth } from "../auth";
import { Session } from "next-auth";
import { proUsers, settings, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { catalyst } from "./catalyst";

export type ApiCtx = {
  db: PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
  };
  session: Session | null;
  user: {
    get?:
      | {
          id: string;
          name: string | null;
          email: string;
          emailVerified: Date | null;
          realtimeSecret: string | null;
          image: string | null;
        }
      | undefined;
    settings: Record<string, string>;
    isPro: boolean;
  };
};

export async function api({ session }: { session?: Session | null }) {
  const ctx = await genCtx({ session });

  return {
    canvas: await canvas(ctx),
    catalyst: await catalyst(ctx),
  };
}

async function genCtx({
  session,
}: {
  session?: Session | null;
}): Promise<ApiCtx> {
  const sql =
    global.db ??
    postgres(process.env.DATABASE_URL!, {
      max: 1,
      ssl: "require",
    });

  if (!global.db) global.db = drizzle(sql as unknown as postgres.Sql<{}>);
  const db = global.db as PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
  };
  session = (session != undefined ? session : await auth()) ?? null;

  if (!session?.user?.id) {
    return {
      db,
      session,
      user: {
        get: undefined,
        settings: {},
        isPro: false,
      },
    };
  }

  const user = (
    await db.select().from(users).where(eq(users.id, session.user.id))
  ).at(0);
  if (user && !user?.realtimeSecret) {
    user.realtimeSecret =
      (Math.random() * 128).toString(36).substring(2) +
      (Math.random() * 128).toString(36).substring(2);
    await db
      .update(users)
      .set({ realtimeSecret: user.realtimeSecret })
      .where(eq(users.id, user.id));
  }
  const userSettings = await db
    .select()
    .from(settings)
    .where(eq(settings.userId, session.user.id));

  const isPro =
    (
      await db
        .select()
        .from(proUsers)
        .where(eq(proUsers.userId, user?.id ?? ""))
    ).length > 0;

  // after(() => {
  //   db.$client.end();
  // });

  return {
    db,
    session,
    user: {
      get: user,
      settings: userSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value ?? "";
        return acc;
      }, {} as Record<string, string>),
      isPro,
    },
  };
}
