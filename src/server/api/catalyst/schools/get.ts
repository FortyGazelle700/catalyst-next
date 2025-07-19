import { type ApiCtx } from "../..";

export default async function getSchool(ctx: ApiCtx) {
  return async ({ id }: { id?: string }) => {
    const { schools, schoolPermissions } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");

    if (!ctx.user.get?.id) {
      return {
        success: false,
        data: undefined,
        errors: [{ message: "Unauthorized" }],
      };
    }

    id ??= (
      await ctx.db
        .select()
        .from(schoolPermissions)
        .where(eq(schoolPermissions.userId, ctx.user.get.id))
        .limit(1)
    )[0]?.schoolId;

    if (!id) {
      return {
        success: false,
        data: undefined,
        errors: [{ message: "Could not infer school id" }],
      };
    }

    const school = await ctx.db
      .select()
      .from(schools)
      .where(eq(schools.id, id))
      .limit(1)
      .then((res) => res[0]);

    if (!school) {
      return {
        success: false,
        data: undefined,
        errors: [{ message: "No school found" }],
      };
    }

    return {
      success: true,
      data: school,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
