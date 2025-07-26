import { type ApiCtx } from "../..";

export default async function getSchool(ctx: ApiCtx) {
  return async ({ id }: { id?: string }) => {
    const { schoolPermissions } = await import("@/server/db/schema");
    const { and, eq } = await import("drizzle-orm");

    if (!ctx.user.get?.id) {
      return {
        success: false,
        data: undefined,
        errors: [{ message: "Unauthorized" }],
      };
    }

    const permissions = (
      await ctx.db
        .select()
        .from(schoolPermissions)
        .where(
          and(
            eq(schoolPermissions.userId, ctx.user.get.id),
            eq(
              schoolPermissions.schoolId,
              id ?? ctx.user.settings.schoolId ?? "",
            ),
          ),
        )
        .limit(1)
    )[0];

    return {
      success: true,
      data: permissions?.role ?? "viewer",
      errors: [] as {
        message: string;
      }[],
    };
  };
}
