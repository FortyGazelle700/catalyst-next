import { type ApiCtx } from "@/server/api";

export default async function getSchool(ctx: ApiCtx) {
  return async ({ id }: { id: string }) => {
    const { settings } = await import("@/server/db/schema");
    const { and, eq } = await import("drizzle-orm");

    if (!ctx.user.get?.id) {
      return {
        success: false,
        data: undefined,
        errors: [{ message: "Unauthorized" }],
      };
    }

    const members = await ctx.db
      .select()
      .from(settings)
      .where(and(eq(settings.key, "school_id"), eq(settings.value, id)));

    return {
      success: true,
      data: members.length,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
