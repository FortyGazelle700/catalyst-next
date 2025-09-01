"use server";

import { type ApiCtx } from "@/server/api";

export default async function createSchool(ctx: ApiCtx) {
  return async (input: {
    schoolId?: string;
    options: {
      observeDST?: boolean;
      timezone?: string;
    };
    schedules: {
      id: string;
      name: string;
      periods: {
        start: string;
        end: string;
        order: number;
        optionId: string;
      }[];
    }[];
  }) => {
    const { schools, schoolPermissions, schedules, periodTimes } = await import(
      "@/server/db/schema"
    );
    const { and, eq } = await import("drizzle-orm");

    if (!ctx.user.get?.id) {
      return {
        success: false,
        data: [],
        errors: [{ message: "Unauthorized" }],
      };
    }

    const school = (
      await ctx.db
        .select()
        .from(schoolPermissions)
        .where(
          input.schoolId
            ? eq(schoolPermissions.schoolId, input.schoolId)
            : and(
                eq(schoolPermissions.userId, ctx.user.get.id),
                eq(schoolPermissions.role, "owner"),
              ),
        )
        .limit(1)
    )[0];

    if (!school) {
      return {
        success: false,
        data: [],
        errors: [{ message: "No school found" }],
      };
    }

    await ctx.db.transaction(async (trx) => {
      await trx
        .update(schools)
        .set({
          observeDST: input.options.observeDST ?? false,
          timezone: input.options.timezone ?? "America/New_York",
        })
        .where(eq(schools.id, school.schoolId));

      await trx
        .delete(schedules)
        .where(eq(schedules.schoolId, school.schoolId));
      await trx
        .delete(periodTimes)
        .where(eq(periodTimes.schoolId, school.schoolId));

      for (const schedule of input.schedules) {
        await trx.insert(schedules).values({
          id: schedule.id,
          schoolId: school.schoolId,
          name: schedule.name,
        });

        for (const period of schedule.periods) {
          await trx.insert(periodTimes).values({
            schoolId: school.schoolId,
            scheduleId: schedule.id,
            start: period.start,
            end: period.end,
            order: period.order,
            optionId: period.optionId,
          });
        }
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
