"use server";

import { type ApiCtx } from "../../..";

export default async function list(ctx: ApiCtx) {
  return async () => {
    return {
      success: true,
      data: ctx.user.settings,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
