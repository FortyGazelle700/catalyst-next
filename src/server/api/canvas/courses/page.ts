"use server";

import type { CanvasApiCtx } from "..";
import type { CanvasErrors, Page } from "../types";

export type FrontPageInput = {
  courseId: number;
  pageId: string;
  useCache?: boolean;
};

export default async function getPage(ctx: CanvasApiCtx) {
  return async (input: FrontPageInput) => {
    const { unstable_cache } = await import("next/cache");
    const page = async () => {
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
        `/api/v1/courses/${input.courseId}/pages/${input.pageId}`,
        ctx.user.canvas.url
      );
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as Page | CanvasErrors;
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
        page,
        [
          `user_${ctx.user.get?.id}:course:page`,
          `user_${ctx.user.get?.id}:course:page@${[
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(",")}`,
        ],
        {
          revalidate: 60,
          tags: [
            `user_${ctx.user.get?.id}:course:page`,
            `user_${ctx.user.get?.id}:course:page@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        }
      )();
    }
    return await page();
  };
}
