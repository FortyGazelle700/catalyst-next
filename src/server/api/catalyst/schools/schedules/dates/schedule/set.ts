import { type ApiCtx } from "../../../../..";

export default async function set(ctx: ApiCtx) {
  return async ({
    id,
    dates,
  }: {
    id?: string;
    dates: { repeat: number; scheduleId: string }[];
  }) => {
    const { scheduleDatesSchedule } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");

    await ctx.db.transaction(async (trx) => {
      await trx
        .delete(scheduleDatesSchedule)
        .where(
          eq(
            scheduleDatesSchedule.schoolId,
            id ?? ctx.user.settings.school_id ?? "",
          ),
        );

      for (const date of dates) {
        await trx.insert(scheduleDatesSchedule).values({
          repeat: date.repeat,
          scheduleId: date.scheduleId,
          schoolId: id ?? ctx.user.settings.school_id ?? "",
        });
      }
    });

    return {
      success: true,
      data: [],
      errors: [] as {
        message: string;
      }[],
    };
  };
}
