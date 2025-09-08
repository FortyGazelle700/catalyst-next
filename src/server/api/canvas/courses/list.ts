"use server";

import type { CanvasApiCtx } from "..";
import type { Course } from "../types";

export type CourseListInput = {
  enrollmentState?: "active" | "invited_or_pending" | "completed";
  limit: number;
  offset: number;
  sorted?: boolean;
  useCache?: boolean;
};

export default async function courseList(ctx: CanvasApiCtx) {
  return async (input: CourseListInput) => {
    const { unstable_cache } = await import("next/cache");
    const { getClassification } = await import(
      "../../utils/courseClassification"
    );
    const courseList = async () => {
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: [] as Course[],
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
        };
      }
      const url = new URL("/api/v1/courses", ctx.user.canvas.url);
      if (input?.enrollmentState) {
        url.searchParams.set("enrollment_state", input.enrollmentState);
      }
      url.searchParams.set("page", String(input?.offset ?? 1));
      url.searchParams.set("include[]", "total_scores");
      url.searchParams.set("per_page", String(input?.limit ?? 100));
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      let data = (await query.json()) as Course[];
      data = data?.map?.((course) => ({
        ...course,
        original_name: course.original_name ?? course.name,
      }));

      data = await Promise.all(
        data?.map(async (course) => ({
          ...course,
          classification: await getClassification(course.original_name),
        })) ?? [],
      );
      return {
        success: true,
        data: data,
        errors: [],
        nextCursor: Number(input?.offset ?? 0) + Number(input?.limit ?? 10),
      };
    };

    if (input?.useCache ?? true) {
      return await unstable_cache(
        courseList,
        [
          `user_${ctx.user.get?.id}:course:list`,
          `user_${ctx.user.get?.id}:course:list@${[
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(",")}`,
        ],
        {
          revalidate: 60,
          tags: [
            `user_${ctx.user.get?.id}:course:list`,
            `user_${ctx.user.get?.id}:course:list@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        },
      )();
    }
    return await courseList();
  };
}
