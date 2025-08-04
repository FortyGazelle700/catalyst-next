"use server";

import { createCipheriv } from "crypto";
import { type ApiCtx } from "@/server/api";

export default async function set(ctx: ApiCtx) {
  return async ({ key, value }: { key: string; value: string }) => {
    const { settings } = await import("@/server/db/schema");
    const { and, eq } = await import("drizzle-orm");
    const { db } = ctx;
    const { id } = ctx.user.get!;
    const { settings: newSettings } = ctx.user;

    if (key == "canvas_token") {
      const cipher = createCipheriv(
        "aes-256-cbc",
        process.env.AUTH_SECRET?.substring(0, 32) ?? "",
        process.env.AUTH_SECRET?.substring(33, 33 + 16) ?? "",
      );
      const encryptedToken =
        cipher.update(value, "utf8", "base64") + cipher.final("base64");
      value = encryptedToken;
    }

    if (key in newSettings) {
      await db
        .update(settings)
        .set({
          value: value,
        })
        .where(and(eq(settings.userId, id), eq(settings.key, key)));
      newSettings[key] = value;
      return;
    } else {
      await db
        .insert(settings)
        .values({
          userId: id,
          key: key,
          value: value,
        })
        .onConflictDoNothing();
    }

    newSettings[key] = value;
    return {
      success: true,
      data: newSettings,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
