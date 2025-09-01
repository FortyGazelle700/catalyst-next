import { type ApiCtx } from "@/server/api";

export default async function list(ctx: ApiCtx) {
  return async ({ id }: { id?: string }) => {
    const { schools, schoolPermissions } = await import("@/server/db/schema");
    const { and, eq } = await import("drizzle-orm");

    if (!ctx.user.get?.id) {
      return {
        success: false,
        data: [],
        errors: [{ message: "Unauthorized" }],
      };
    }

    let permissions = await ctx.db
      .select()
      .from(schoolPermissions)
      .where(
        and(
          eq(schoolPermissions.userId, ctx.user.get.id),
          eq(schoolPermissions.role, "owner"),
        ),
      );

    if (id) {
      if (!permissions.some((p) => p.schoolId == id)) {
        return {
          success: false,
          data: [],
          errors: [{ message: "Unauthorized" }],
        };
      }

      permissions = permissions.filter((p) => p.schoolId == id);
    }

    if (permissions.length == 0) {
      return {
        success: false,
        data: [],
        errors: [{ message: "No schools found" }],
      };
    }

    await ctx.db
      .delete(schools)
      .where(and(eq(schools.id, permissions[0]!.schoolId)));

    return {
      success: true,
      data: [permissions[0]!.schoolId],
      errors: [] as {
        message: string;
      }[],
    };
  };
}
