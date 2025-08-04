"use server";

import type { InferSelectModel } from "drizzle-orm";
import type { sessions } from "@/server/db/schema";
import { type ApiCtx } from "@/server/api";

export type SessionResult = InferSelectModel<typeof sessions> & {
  isCurrent: boolean;
};

export default async function list(ctx: ApiCtx) {
  return async () => {
    const { sessions } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");

    const allSessions = await ctx.db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, ctx.user.get!.id));

    const updatedSessions = allSessions.map((session) => ({
      ...session,
      isCurrent: session.sessionToken == ctx.session?.sessionToken,
    }));

    return {
      success: true,
      data: updatedSessions,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
