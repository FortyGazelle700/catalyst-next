import { ApiCtx } from "../..";

export default async function list(ctx: ApiCtx) {
  return async () => {
    const { schools } = await import("@/server/db/schema");
    const schoolsList = await ctx.db.select().from(schools);
    return {
      success: true,
      data: schoolsList,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
