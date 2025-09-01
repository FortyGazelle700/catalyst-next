"use server";

import { type ApiCtx } from "@/server/api";

export default async function set(ctx: ApiCtx) {
  return async (input: Record<string, string>) => {
    const { scheduleValues } = await import("@/server/db/schema");
    const { eq, and, count } = await import("drizzle-orm");
    const { revalidateTag } = await import("next/cache");

    for (const [key, value] of Object.entries(input)) {
      const existing = await ctx.db
        .select({ count: count() })
        .from(scheduleValues)
        .where(
          and(
            eq(scheduleValues.userId, ctx.user.get!.id),
            eq(scheduleValues.periodId, key),
          ),
        );
      if (existing.at(0)?.count == 0) {
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
              eq(scheduleValues.periodId, key),
            ),
          );
      }
    }

    revalidateTag(`user_${ctx.user.get?.id}:course:list_with_data`);

    return {
      success: true,
      data: null,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
