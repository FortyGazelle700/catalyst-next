"use server";

import type { InferSelectModel } from "drizzle-orm";
import type { sessions } from "@/server/db/schema";
import { type ApiCtx } from "../../..";

export type SessionResult = InferSelectModel<typeof sessions> & {
  isCurrent: boolean;
};

export default async function list(ctx: ApiCtx) {
  return async () => {
    const { scheduleValues } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");

    const values = await ctx.db
      .select()
      .from(scheduleValues)
      .where(eq(scheduleValues.userId, ctx.user.get!.id));

    return {
      success: true,
      data: values,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
