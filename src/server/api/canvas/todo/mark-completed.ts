"use server";

import type { CanvasApiCtx } from "..";
import type { CanvasErrors, PlannerItem, Assignment } from "../types";
import { eq, and } from "drizzle-orm";

export type CompleteInput = {
  id: number;
  complete: boolean;
};

async function updateDbOverride(ctx: CanvasApiCtx, input: CompleteInput) {
  const { assignmentOverrides } = await import("@/server/db/schema");
  const existingOverride = await ctx.db
    .select()
    .from(assignmentOverrides)
    .where(
      and(
        eq(assignmentOverrides.userId, ctx.user.get?.id ?? ""),
        eq(assignmentOverrides.assignmentId, String(input.id)),
      ),
    );

  if (existingOverride.length == 0) return null;

  await ctx.db
    .update(assignmentOverrides)
    .set({
      markedComplete: input.complete,
      updatedAt: new Date(),
    })
    .where(eq(assignmentOverrides.id, existingOverride[0]!.id));

  return {
    success: true,
    data: {
      id: 0,
      plannable_type: "assignment",
      plannable_id: String(input.id),
      user_id: 0,
      assignment_id: input.id,
      workflow_state: "active",
      marked_complete: input.complete,
      dismissed: false,
      created_at:
        existingOverride[0]!.createdAt?.toISOString() ??
        new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plannable: {
        id: input.id,
        todo_date:
          existingOverride[0]!.dueAt?.toISOString() ?? new Date().toISOString(),
        title: `Assignment ${input.id}`,
        details: existingOverride[0]!.userDescription?.description ?? "",
        user_id: 0,
        course_id: existingOverride[0]!.courseId
          ? parseInt(existingOverride[0]!.courseId)
          : undefined,
        workflow_state: "assigned",
        created_at:
          existingOverride[0]!.createdAt?.toISOString() ??
          new Date().toISOString(),
        updated_at: new Date().toISOString(),
        content_details: {} as Assignment,
        due_at: existingOverride[0]!.dueAt?.toISOString(),
      },
      html_url: "",
    } as unknown as PlannerItem,
    errors: [],
  };
}

async function handleCanvasError(
  ctx: CanvasApiCtx,
  input: CompleteInput,
  data: PlannerItem | CanvasErrors,
) {
  const errorData = data as CanvasErrors;
  return {
    success: false,
    data: undefined,
    errors: errorData.errors ?? [
      { message: "Failed to create Canvas planner override" },
    ],
  };
}

export default async function markTodoItemComplete(ctx: CanvasApiCtx) {
  return async (input: CompleteInput) => {
    const { revalidateTag } = await import("next/cache");
    const { default: miniTodoList } = await import("./mini");

    if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
      return {
        success: false,
        data: [],
        errors: [{ message: "Canvas URL or token not found" }],
      };
    }

    const { data: plannerItems, success } = await (await miniTodoList(ctx))({});
    if (!success) {
      return {
        success: false,
        data: undefined,
        errors: plannerItems,
      };
    }

    const plannerItem = plannerItems?.find(
      (override) => override.plannable_id == String(input.id),
    );

    let url: URL;
    let method: "POST" | "PUT";
    let overrideId: number | undefined;

    if (plannerItem?.planner_override == null) {
      url = new URL("/api/v1/planner/overrides", ctx.user.canvas.url);
      method = "POST";
    } else {
      url = new URL(
        `/api/v1/planner/overrides/${plannerItem.planner_override.id}`,
        ctx.user.canvas.url,
      );
      method = "PUT";
      overrideId = plannerItem.planner_override.id;
    }

    url.searchParams.append('locale', 'en');
    const query = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${ctx.user.canvas.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: overrideId,
        plannable_id: input.id,
        plannable_type: plannerItem?.plannable_type,
        marked_complete: input.complete,
      }),
    });

    const data = (await query.json()) as PlannerItem | CanvasErrors;

    if (!query.ok) {
      const dbResult = await updateDbOverride(ctx, input);
      if (dbResult) {
        revalidateTag(`user_${ctx.user.get?.id}:todo:list`);
        revalidateTag(`user_${ctx.user.get?.id}:todo:mini`);
        return dbResult;
      }
      return await handleCanvasError(ctx, input, data);
    }

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
}
