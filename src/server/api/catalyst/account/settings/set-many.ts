"use server";

import { type ApiCtx } from "@/server/api";
import set from "./set";

export default async function setMany(ctx: ApiCtx) {
  return async (kv: Record<string, string>) => {
    const { settings: newSettings } = ctx.user;
    // const { data: proUser } = await (await isPro(ctx))();
    const { revalidateTag } = await import("next/cache");

    for (const k of Object.keys(kv)) {
      const key = k;
      const value = kv[key]!;

      await (
        await set(ctx)
      )({ key, value });

      newSettings[key] = value;
    }

    revalidateTag(`user_${ctx.user.get?.id}:course:list_with_data`);

    return {
      success: true,
      data: newSettings,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
