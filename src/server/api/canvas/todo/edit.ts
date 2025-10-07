"use server";

import type { CanvasApiCtx } from "..";
import type { CanvasErrors, PlannerItem } from "../types";

export type CompleteInput = {
  id: number;
  title: string;
  description: string;
  due_at: string;
  course_id: number;
};

export default async function editTodoNote(ctx: CanvasApiCtx) {
  return async (input: CompleteInput) => {
    const { revalidateTag } = await import("next/cache");

    const edit = async () => {
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: [] as PlannerItem[],
          errors: [{ message: "Canvas URL or token not found" }],
        };
      }
      const url = new URL(
        `/api/v1/planner_notes/${input.id}`,
        ctx.user.canvas.url,
      );
      url.searchParams.append("locale", "en");
      const query = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: input.id,
          title: input.title,
          details: input.description,
          todo_date: input.due_at,
          course_id: input.course_id,
        }),
      });
      const data = (await query.json()) as PlannerItem | CanvasErrors;
      if ("errors" in data) {
        return {
          success: false,
          data: undefined,
          errors: data.errors,
        };
      }
      revalidateTag(`user_${ctx.user.get?.id}:todo:list`);
      revalidateTag(`user_${ctx.user.get?.id}:todo:mini`);
      return {
        success: true,
        data: data,
        errors: [],
      };
    };
    return await edit();
  };
}
