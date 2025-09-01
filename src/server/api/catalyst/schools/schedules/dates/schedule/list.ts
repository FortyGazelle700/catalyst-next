import { type ApiCtx } from "@/server/api";

export default async function list(ctx: ApiCtx) {
  return async ({ id }: { id?: string }) => {
    const { scheduleDatesSchedule } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");

    const schoolSchedules = await ctx.db
      .select()
      .from(scheduleDatesSchedule)
      .where(
        eq(
          scheduleDatesSchedule.schoolId,
          id ?? ctx.user.settings.school_id ?? "",
        ),
      );

    return {
      success: true,
      data: schoolSchedules,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
