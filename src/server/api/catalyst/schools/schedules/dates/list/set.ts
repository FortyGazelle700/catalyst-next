import { type ApiCtx } from "@/server/api";

export default async function set(ctx: ApiCtx) {
  return async ({
    id,
    dates,
  }: {
    id?: string;
    dates: { date: Date; scheduleId: string }[];
  }) => {
    const { scheduleDates } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");

    await ctx.db.transaction(async (trx) => {
      await trx
        .delete(scheduleDates)
        .where(
          eq(scheduleDates.schoolId, id ?? ctx.user.settings.school_id ?? ""),
        );

      for (const date of dates) {
        await trx.insert(scheduleDates).values({
          date: new Date(date.date),
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
