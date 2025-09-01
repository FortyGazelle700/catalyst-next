import { type ApiCtx } from "@/server/api";

export default async function list(ctx: ApiCtx) {
  return async ({ id }: { id?: string }) => {
    const { schedules } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");

    const schoolSchedules = await ctx.db
      .select()
      .from(schedules)
      .where(eq(schedules.schoolId, id ?? ctx.user.settings.school_id ?? ""));

    return {
      success: true,
      data: schoolSchedules,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
