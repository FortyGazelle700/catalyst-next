"use server";

import { type ApiCtx } from "../../..";

export default async function list(ctx: ApiCtx) {
  return async () => {
    return {
      success: true,
      data: {
        ...ctx.user.settings,
        email: ctx.user.get?.email,
      } as Record<string, string | undefined>,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
