"use server";

import type { CanvasApiCtx } from "../..";
import type { CanvasErrors, ModuleItem } from "../../types";
import getModules from "./list";

export type FrontPageInput = {
  courseId: number;
  itemId: number;
  useCache?: boolean;
};

export default async function getModule(ctx: CanvasApiCtx) {
  return async (input: FrontPageInput) => {
    const { unstable_cache } = await import("next/cache");
    const moduleItem = async () => {
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: undefined,
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
        };
      }
      const { data: modules } = await (
        await getModules(ctx)
      )({
        courseId: input.courseId,
        useCache: input?.useCache ?? true,
      });
      const moduleId = modules?.find((m) =>
        m.items?.some((i) => i.id === input.itemId),
      )?.id;
      const url = new URL(
        `/api/v1/courses/${input.courseId}/modules/${moduleId}/items/${input.itemId}`,
        ctx.user.canvas.url,
      );
      url.searchParams.append("include[]", "submission");
      url.searchParams.append("include[]", "score_statistics");
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as ModuleItem | CanvasErrors;
      if ("errors" in data) {
        return {
          success: false,
          data: undefined,
          errors: data.errors,
        };
      }
      return {
        success: true,
        data: data,
        errors: [],
      };
    };

    if (input?.useCache ?? true) {
      return await unstable_cache(
        moduleItem,
        [
          ctx.user.get?.id ?? "",
          [
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(","),
        ],
        {
          revalidate: 60,
          tags: [
            `user_${ctx.user.get?.id}:course:module`,
            `user_${ctx.user.get?.id}:course:module@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        },
      )();
    }
    return await moduleItem();
  };
}
