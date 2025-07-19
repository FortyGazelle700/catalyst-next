"use server";

import { type ApiCtx } from "../..";
import set from "./set";

export default async function setMany(ctx: ApiCtx) {
  return async (kv: Record<string, string>) => {
    const { settings: newSettings } = ctx.user;

    for (const k of Object.keys(kv)) {
      const key = k;
      const value = kv[key]!;

      await (
        await set(ctx)
      )({ key, value });

      newSettings[key] = value;
    }

    return {
      success: true,
      data: newSettings,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
