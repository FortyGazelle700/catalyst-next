"use server";

import type { periodType } from "@/server/db/schema";
import { type ApiCtx } from "@/server/api";

export default async function createSchool(ctx: ApiCtx) {
  return async (input: {
    schoolId?: string;
    periods: {
      id: string;
      name: string;
      order: number;
      options?: {
        id: string;
        order: number;
        name: string;
      }[];
      type: (typeof periodType.enumValues)[number];
    }[];
  }) => {
    const { schoolPermissions, periods } = await import("@/server/db/schema");
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
      await trx.delete(periods).where(eq(periods.schoolId, school.schoolId));

      for (const period of input.periods) {
        if (period.options) {
          for (const option of period.options) {
            await trx.insert(periods).values({
              periodId: period.id,
              optionId: option.id,
              periodOrder: period.order,
              optionOrder: option.order,
              periodName: period.name,
              optionName: option.name,
              type: period.type,
              schoolId: school.schoolId,
            });
          }
        } else {
          await trx.insert(periods).values({
            periodId: period.id,
            optionId: period.id,
            periodOrder: period.order,
            optionOrder: 1,
            periodName: period.name,
            optionName: period.name,
            type: period.type,
            schoolId: school.schoolId,
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
