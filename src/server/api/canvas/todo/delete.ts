"use server";

import type { CanvasApiCtx } from "..";
import type { CanvasErrors, PlannerNote } from "../types";

export type TodoListInput = {
  id: number;
};

export default async function deleteNote(ctx: CanvasApiCtx) {
  return async (input: TodoListInput) => {
    const note = async () => {
      const { revalidateTag } = await import("next/cache");
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: undefined as PlannerNote | undefined,
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
        };
      }
      const url = new URL(
        `/api/v1/planner_notes/${input.id}`,
        ctx.user.canvas.url,
      );
      url.searchParams.append('locale', 'en');
      const query = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as PlannerNote | CanvasErrors;
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
        data,
        errors: [],
      };
    };
    return await note();
  };
}
