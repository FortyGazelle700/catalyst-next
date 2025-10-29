"use server";

import type { CanvasApiCtx } from "..";
import type { Tab } from "../types";

export type TabsInput = {
  courseId: number;
  useCache?: boolean;
};

export default async function tabs(ctx: CanvasApiCtx) {
  return async (input: TabsInput) => {
    const { unstable_cache } = await import("next/cache");

    const tabs = async () => {
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
      const url = new URL(
        `/api/v1/courses/${input.courseId}/tabs`,
        ctx.user.canvas.url,
      );
      url.searchParams.append("locale", "en");
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
          "Accept-Language": "en",
        },
      });
      const data = (await query.json()) as Tab[];
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
        tabs,
        [
          ctx.user.get?.id ?? "",
          Object.entries(input)
            .map(([k, v]) => `${k}=${v}`)
            .sort((a, b) => a.localeCompare(b))
            .join(","),
        ],
        {
          revalidate: 60,
          tags: [
            `user_${ctx.user.get?.id}:course:link`,
            `user_${ctx.user.get?.id}:course:link@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        },
      )();
    }
    return await tabs();
  };
}
