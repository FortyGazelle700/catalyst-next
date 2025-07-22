import { type ApiCtx } from "../../..";

export default async function list(ctx: ApiCtx) {
  return async ({ id }: { id?: string }) => {
    const { sessions } = await import("@/server/db/schema");
    const { and, eq } = await import("drizzle-orm");

    if (!ctx.user.get?.id) {
      return {
        success: false,
        data: [],
        errors: [{ message: "Unauthorized" }],
      };
    }

    if (!id) {
      return {
        success: false,
        data: [],
        errors: [{ message: "Session ID is required" }],
      };
    }

    const session = (
      await ctx.db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.sessionToken, id),
            eq(sessions.userId, ctx.user.get.id),
          ),
        )
        .limit(1)
    )[0];

    if (!session) {
      return {
        success: false,
        data: [],
        errors: [{ message: "Session not found" }],
      };
    }

    await ctx.db
      .delete(sessions)
      .where(
        and(
          eq(sessions.sessionToken, id),
          eq(sessions.userId, ctx.user.get.id),
        ),
      );

    return {
      success: true,
      data: [id],
      errors: [] as {
        message: string;
      }[],
    };
  };
}
