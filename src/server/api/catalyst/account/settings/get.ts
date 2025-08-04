"use server";

import { type ApiCtx } from "@/server/api";

export default async function list(ctx: ApiCtx) {
  return async ({ key }: { key: string }) => {
    return {
      success: true,
      data: (
        {
          ...ctx.user.settings,
          email: ctx.user.get?.email,
        } as Record<string, string>
      )[key],
      errors: [] as {
        message: string;
      }[],
    };
  };
}
