import { type ApiCtx } from "../../../../..";

export default async function list(ctx: ApiCtx) {
  return async ({ id }: { id?: string }) => {
    const { scheduleDates } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");

    const schoolSchedules = await ctx.db
      .select()
      .from(scheduleDates)
      .where(
        eq(scheduleDates.schoolId, id ?? ctx.user.settings.school_id ?? ""),
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
