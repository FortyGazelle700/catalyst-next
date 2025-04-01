"use server";

import { ApiCtx } from "../..";
import set from "./set";

export default async function setMany(ctx: ApiCtx) {
  return async (kv: Record<string, string>) => {
    const { settings } = await import("@/server/db/schema");
    const { and, eq } = await import("drizzle-orm");
    const { db } = ctx;
    const { id } = ctx.user.get!;
    const { settings: newSettings } = ctx.user;

    Object.entries(kv).forEach(async ([key, value]) => {
      key = key!;
      value = value!;

      await (
        await set(ctx)
      )({ key, value });

      newSettings[key] = value;
    });

    return {
      success: true,
      data: newSettings,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
