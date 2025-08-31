"use server";

import { type ApiCtx } from "@/server/api";

export default async function isPro(ctx: ApiCtx) {
  return async () => {
    return {
      success: true,
      data: ctx.user.isPro ?? false,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
