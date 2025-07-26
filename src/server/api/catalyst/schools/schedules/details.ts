import { type ApiCtx } from "../../..";

export default async function details(ctx: ApiCtx) {
  return async ({
    schoolId,
    scheduleId,
  }: {
    schoolId: string;
    scheduleId: string;
  }) => {
    const { api } = await import("@/server/api");
    const { periodTimes } = await import("@/server/db/schema");
    const { and, eq } = await import("drizzle-orm");

    const { data: periods } = await (
      await api({})
    ).catalyst.schools.periods.list({ id: schoolId });

    const periodList = await ctx.db
      .select()
      .from(periodTimes)
      .where(
        and(
          eq(periodTimes.schoolId, schoolId),
          eq(periodTimes.scheduleId, scheduleId),
        ),
      );

    const betterPeriods = periodList.map((period) => ({
      ...period,
      period: {
        ...periods.find((p) => p.optionId == period.optionId)!,
        ...period,
      },
    }));

    return {
      success: true,
      data: betterPeriods,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
