"use server";

import type { CanvasApiCtx } from "..";
import type { CanvasErrors, PlannerItem } from "../types";

export type CompleteInput = {
  id: number;
  complete: boolean;
};

export default async function markTodoItemComplete(ctx: CanvasApiCtx) {
  return async (input: CompleteInput) => {
    const { revalidateTag } = await import("next/cache");
    const { default: miniTodoList } = await import("./mini");
    const markComplete = async () => {
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: [] as PlannerItem[],
          errors: [{ message: "Canvas URL or token not found" }],
        };
      }
      const { data: plannerItems, success } = await (
        await miniTodoList(ctx)
      )({});
      if (!success) {
        return {
          success: false,
          data: undefined,
          errors: plannerItems,
        };
      }
      const plannerItem = plannerItems?.find(
        (override) => override.plannable_id == String(input.id)
      );
      if (plannerItem?.planner_override == null) {
        const url = new URL("/api/v1/planner/overrides", ctx.user.canvas.url);
        const query = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plannable_id: input.id,
            plannable_type: plannerItem?.plannable_type,
            marked_complete: input.complete,
          }),
        });
        const json = (await query.json()) as PlannerItem;
        return {
          success: true,
          data: json,
          errors: [],
        };
      } else {
        const url = new URL(
          `/api/v1/planner/overrides/${plannerItem.planner_override.id}`,
          ctx.user.canvas.url
        );
        const query = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: plannerItem.planner_override?.id,
            plannable_id: input.id,
            plannable_type: plannerItem.plannable_type,
            marked_complete: input.complete,
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
        return {
          success: true,
          data: data,
          errors: [],
        };
      }
    };
    revalidateTag("todo");
    revalidateTag("mini_todo");
    return await markComplete();
  };
}
