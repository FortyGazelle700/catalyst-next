"use server";

import { createCipheriv } from "crypto";
import { ApiCtx } from "../..";

export default async function set(ctx: ApiCtx) {
  return async (input: Record<string, string>) => {
    const { scheduleValues } = await import("@/server/db/schema");
    const { eq, and, count } = await import("drizzle-orm");

    Object.entries(input).forEach(async ([key, value]) => {
      if (
        (
          await ctx.db
            .select({ count: count() })
            .from(scheduleValues)
            .where(
              and(
                eq(scheduleValues.userId, ctx.user.get!.id),
                eq(scheduleValues.periodId, key)
              )
            )
        ).at(0)?.count == 0
      ) {
        await ctx.db.insert(scheduleValues).values({
          userId: ctx.user.get!.id,
          periodId: key,
          value: value,
        });
      } else {
        await ctx.db
          .update(scheduleValues)
          .set({ value: value })
          .where(
            and(
              eq(scheduleValues.userId, ctx.user.get!.id),
              eq(scheduleValues.periodId, key)
            )
          );
      }
    });

    return {
      success: true,
      data: null,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
