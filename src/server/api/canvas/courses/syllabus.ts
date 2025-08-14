"use server";

import type { CanvasApiCtx } from "..";
import type { CanvasErrors, Course, Page } from "../types";

export type FrontPageInput = {
  courseId: number;
  useCache?: boolean;
};

export default async function frontPage(ctx: CanvasApiCtx) {
  return async (input: FrontPageInput) => {
    const { unstable_cache } = await import("next/cache");

    const frontPage = async () => {
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
        `/api/v1/courses/${input.courseId}`,
        ctx.user.canvas.url,
      );
      url.searchParams.set("include[]", "syllabus_body");
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as Course | CanvasErrors;
      if ("errors" in data) {
        return {
          success: false,
          data: undefined,
          errors: data.errors,
        };
      }
      return {
        success: true,
        data: data.syllabus_body,
        errors: [],
      };
    };

    if (input?.useCache ?? true) {
      return await unstable_cache(
        frontPage,
        [
          `user_${ctx.user.get?.id}:course:front_page`,
          `user_${ctx.user.get?.id}:course:front_page@${[
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(",")}`,
        ],
        {
          revalidate: 60,
          tags: [
            `user_${ctx.user.get?.id}:course:front_page`,
            `user_${ctx.user.get?.id}:course:front_page@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        },
      )();
    }
    return await frontPage();
  };
}
