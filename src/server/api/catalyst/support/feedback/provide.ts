"use server";

import { type ApiCtx } from "../../..";

export default async function provideFeedback(ctx: ApiCtx) {
  return async (input: {
    category: string;
    importance: string;
    title: string;
    description: string;
    pathname: string;
    date: Date;
  }) => {
    const { feedback } = await import("@/server/db/schema");

    await ctx.db.insert(feedback).values({
      category: input.category,
      importance: input.importance,
      title: input.title,
      description: input.description,
      pathname: input.pathname,
      userId: ctx.user.get?.id ?? "<unknown>",
      date: input.date.toISOString(),
    });
    return {
      success: true,
      data: ctx.user.settings,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
