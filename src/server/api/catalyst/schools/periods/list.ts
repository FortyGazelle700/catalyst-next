import { ApiCtx } from "../../..";

export default async function list(ctx: ApiCtx) {
  return async ({ id }: { id?: string }) => {
    const { periods } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");
    const schoolPeriods = await ctx.db
      .select()
      .from(periods)
      .where(eq(periods.schoolId, id ?? ctx.user.settings["school_id"] ?? ""));

    const usedPeriods = new Set<string>();

    const finalPeriods = schoolPeriods
      .map((period) => {
        let options = undefined;
        if (period.type == "single") {
          if (usedPeriods.has(period.periodId)) {
            return undefined;
          }
          usedPeriods.add(period.periodId);
          options = schoolPeriods
            .filter((p) => p.periodId == period.periodId)
            .map((opt) => ({
              ...opt,
              id: opt.optionId,
              name: opt.optionName,
            }))
            .sort((a, b) => (a?.optionOrder ?? 0) - (b?.optionOrder ?? 0));
        }
        return {
          ...period,
          id: period.periodId,
          name: period.periodName,
          type: period.type!,
          periodOrder: period.periodOrder!,
          optionOrder: period.optionOrder!,
          options,
        };
      })
      .filter((p) => p != undefined)
      .sort((a, b) => (a?.periodOrder ?? 0) - (b?.periodOrder ?? 0));

    return {
      success: true,
      data: finalPeriods,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
