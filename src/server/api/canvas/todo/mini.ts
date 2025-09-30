"use server";

import type { CanvasApiCtx } from "..";
import getAssignment from "../courses/assignments/get";
import courseList from "../courses/list";
import type { Assignment, CanvasErrors, Course, PlannerItem } from "../types";
import { eq } from "drizzle-orm";

export type TodoListInput = {
  days?: number;
  useCache?: boolean;
};

export default async function miniTodoList(ctx: CanvasApiCtx) {
  return async (input: TodoListInput) => {
    const { unstable_cache } = await import("next/cache");

    const todoList = async () => {
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
      // Parallelize course and assignment fetches
      await Promise.all(
        data.map(async (item) => {
          const courseURL = new URL(
            `/api/v1/courses/${item.course_id ?? item.plannable.course_id}`,
            ctx.user.canvas.url,
          );
          const courseQuery = fetch(courseURL, {
            headers: {
              Authorization: `Bearer ${ctx.user.canvas.token}`,
            },
          });

          let assignmentQuery: Promise<Response> | undefined;
          if (item.plannable_type == "assignment") {
            const assignmentURL = new URL(
              `/api/v1/courses/${item.course_id}/assignments/${item.plannable.id}`,
              ctx.user.canvas.url,
            );
            assignmentURL.searchParams.append("include[]", "submission");
            assignmentQuery = fetch(assignmentURL, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });
          }

          item.course = (await (await courseQuery).json()) as Course;
          if (assignmentQuery) {
            item.plannable.content_details = (await (
              await assignmentQuery
            ).json()) as Assignment;
          }
        }),
      );

      // Apply assignment overrides after fetching all data
      if (ctx.user.get?.id) {
        const { assignmentOverrides } = await import("@/server/db/schema");

        // Get all assignment overrides for this user
        const overrides = await ctx.db
          .select()
          .from(assignmentOverrides)
          .where(eq(assignmentOverrides.userId, ctx.user.get.id));

        for (const override of overrides) {
          const { data: assignment } = await (
            await getAssignment(ctx)
          )({
            courseId: Number(override.courseId),
            assignmentId: Number(override.assignmentId),
            useCache: false,
          });

          const { data: courses } = await (
            await courseList(ctx)
          )({ useCache: true, offset: 0, limit: 100 });
          const assignmentCourse = courses?.find(
            (c) => c.id == Number(override.courseId),
          );

          if (
            data.find(
              (d) =>
                d.plannable.content_details.id == Number(override.assignmentId),
            )
          ) {
            continue;
          }

          data.push({
            plannable: {
              id: Number(override.assignmentId),
              course_id: Number(override.courseId),
              content_details: assignment as Assignment,
              details:
                override.userDescription?.description ??
                assignment?.description ??
                "",
              todo_date:
                override.dueAt?.toISOString() ??
                assignment?.due_at ??
                new Date().toISOString(),
              title: assignment?.name ?? "Unknown Assignment",
              created_at: assignment?.created_at ?? new Date().toISOString(),
              updated_at: assignment?.updated_at ?? new Date().toISOString(),
              workflow_state: assignment?.workflow_state ?? "assigned",
              user_id: 0,
            },
            course_id: Number(override.courseId),
            course: assignmentCourse,
            plannable_type: "assignment",
            plannable_date:
              override.dueAt?.toISOString() ?? assignment?.due_at ?? undefined,
            submissions: !!assignment?.submission,
            html_url: new URL(assignment?.html_url ?? "").pathname,
            plannable_id: override.assignmentId,
            context_type: "assignment",
            planner_override: override.markedComplete
              ? {
                  id: 0,
                  plannable_type: "assignment",
                  plannable_id: Number(override.assignmentId),
                  user_id: 0,
                  assignment_id: Number(override.assignmentId),
                  workflow_state: "active",
                  marked_complete: true,
                  dismissed: false,
                  created_at:
                    override.createdAt?.toISOString() ??
                    new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              : (null as unknown as PlannerItem["planner_override"]),
          });
        }
      }

      return {
        success: true,
        data: data.toSorted((a, b) => {
          const dateA = new Date(
            a.plannable_date ?? a.plannable.due_at ?? "",
          ).getTime();
          const dateB = new Date(
            b.plannable_date ?? b.plannable.due_at ?? "",
          ).getTime();
          return dateA - dateB;
        }),
        errors: [],
      };
    };

    if ((input.useCache ?? true) == false) {
      return await todoList();
    }

    return await unstable_cache(
      todoList,
      [
        ctx.user.get?.id ?? "<null>",
        [
          ...Object.entries(input)
            .map(([k, v]) => `${k}=${v}`)
            .sort((a, b) => a.localeCompare(b)),
        ].join(","),
        String(new Date().getUTCHours()),
        String(new Date().getUTCDate()),
      ],
      {
        revalidate: 1000 * 60 * 5,
        tags: [`user_${ctx.user.get?.id}:todo:mini`],
      },
    )();
  };
}
