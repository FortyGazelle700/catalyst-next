"use server";

import { type CanvasApiCtx } from "../../..";

export type CompleteInput = {
  courseId: string;
  assignmentId: string;
  dueDate?: string | null;
  duration?: number | null;
  customStatus?: "none" | "stuck" | "in_progress" | "completed" | null;
  userDescription?: {
    description: string;
    links: { label: string; href: string }[];
  };
};

export default async function setCustomAssignment(ctx: CanvasApiCtx) {
  return async (input: CompleteInput) => {
    const { revalidateTag } = await import("next/cache");
    const { and, eq } = await import("drizzle-orm");
    const { assignmentOverrides } = await import("@/server/db/schema");

    const edit = async () => {
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: null,
          errors: [{ message: "Canvas URL or token not found" }],
        };
      }
      const existing = await ctx.db
        .select()
        .from(assignmentOverrides)
        .where(
          and(
            eq(assignmentOverrides.userId, ctx.user.get!.id),
            eq(assignmentOverrides.courseId, input.courseId),
            eq(assignmentOverrides.assignmentId, input.assignmentId),
          ),
        )
        .limit(1);

      await ctx.db
        .insert(assignmentOverrides)
        .values({
          // @ts-expect-error -- This is correct, TS is just confused
          id: existing[0]?.id ?? crypto.randomUUID(),
          userDescription: input.userDescription ?? "",
          userId: ctx.user.get!.id,
          courseId: parseInt(input.courseId, 10),
          assignmentId: input.assignmentId,
          dueAt: input.dueDate ? new Date(input.dueDate) : null,
          duration: input.duration ?? null,
          status: input.customStatus ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [assignmentOverrides.id],
          set: {
            dueAt: input.dueDate
              ? new Date(input.dueDate)
              : assignmentOverrides.dueAt,
            duration: input.duration ?? assignmentOverrides.duration,
            status: input.customStatus ?? assignmentOverrides.status,
            updatedAt: new Date(),
          },
        });

      revalidateTag(`user_${ctx.user.get?.id}:todo:list`);
      revalidateTag(`user_${ctx.user.get?.id}:todo:mini`);
      return {
        success: true,
        data: null,
        errors: [],
      };
    };
    return await edit();
  };
}
