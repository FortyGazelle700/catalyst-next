"use server";

import type { CanvasApiCtx } from "..";
import type { Assignment, CanvasErrors, Course, PlannerItem } from "../types";

export type TodoListInput = {
  days?: number;
};

export default async function miniTodoList(ctx: CanvasApiCtx) {
  return async (input: TodoListInput) => {
    const { unstable_cache } = await import("next/cache");

    const todoList = async () => {
      console.log("list", ctx?.user?.get?.name);
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: [] as PlannerItem[],
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
        };
      }
      const url = new URL("/api/v1/planner/items", ctx.user.canvas.url);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + (input.days ?? 14));
      url.searchParams.append("start_date", startDate.toISOString());
      url.searchParams.append("end_date", endDate.toISOString());
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as PlannerItem[] | CanvasErrors;
      if ("errors" in data) {
        return {
          success: false,
          data: undefined,
          errors: data.errors,
        };
      }
      for (const item of data) {
        const courseURL = new URL(
          `/api/v1/courses/${item.course_id ?? item.plannable.course_id}`,
          ctx.user.canvas.url
        );
        const courseQuery = await fetch(courseURL, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        item.course = (await courseQuery.json()) as Course;

        if (item.plannable_type == "assignment") {
          const assignmentURL = new URL(
            `/api/v1/courses/${item.course_id}/assignments/${item.plannable.id}`,
            ctx.user.canvas.url
          );
          assignmentURL.searchParams.append("include[]", "submission");
          const assignmentQuery = await fetch(assignmentURL, {
            headers: {
              Authorization: `Bearer ${ctx.user.canvas.token}`,
            },
          });
          item.plannable.content_details =
            (await assignmentQuery.json()) as Assignment;
        }
      }
      return {
        success: true,
        data,
        errors: [],
      };
    };

    console.log("api", ctx?.user?.get?.name);
    if (true) {
      return await unstable_cache(
        todoList,
        [
          `user_${ctx.user.get?.id}:todo:mini`,
          `user_${ctx.user.get?.id}:todo:mini@${[
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(",")}`,
        ],
        {
          revalidate: 1000 * 60 * 5,
          tags: [
            `user_${ctx.user.get?.id}:todo:mini`,
            `user_${ctx.user.get?.id}:todo:mini@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        }
      )();
    } else {
      return await todoList();
    }
  };
}
