import { type ApiCtx } from "../..";

export default async function list(ctx: ApiCtx) {
  return async () => {
    const { schools, schoolPermissions, periods } = await import(
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

    const schoolsList = (
      await ctx.db.select().from(schools).where(eq(schools.isPublic, true))
    ).map((school) => ({
      ...school,
      isComplete: true,
    }));

    const userPermissions = await ctx.db
      .select()
      .from(schoolPermissions)
      .where(
        and(
          eq(schoolPermissions.userId, ctx.user.get.id),
          eq(schoolPermissions.role, "owner")
        )
      );

    if (userPermissions.length > 0) {
      const schoolIds = userPermissions.map((perm) => perm.schoolId);
      for (const schoolId of schoolIds) {
        const school = await ctx.db
          .select()
          .from(schools)
          .where(eq(schools.id, schoolId))
          .limit(1)
          .then((res) => res[0]);

        const periodsList = await ctx.db
          .select()
          .from(periods)
          .where(eq(periods.schoolId, schoolId))
          .limit(1);

        if (school) {
          schoolsList.push({
            ...school,
            isComplete: periodsList.length > 0,
          });
        }
      }
    }

    return {
      success: true,
      data: schoolsList,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
