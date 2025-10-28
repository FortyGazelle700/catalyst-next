"use server";

import type { CanvasApiCtx } from "..";
import type { Assignment, CanvasErrors, Course, PlannerItem } from "../types";

export type TodoListInput = {
  search: {
    title: string;
    description: string;
    start: Date;
    end: Date;
    completed: "yes" | "no" | "all";
    courses: string[];
    status: ("graded" | "submitted" | "unsubmitted" | "")[];
  };
  sort: (
    | "date"
    | "course"
    | "completed"
    | "status"
    | "title"
    | "description"
  )[];
};

export default async function todoList(ctx: CanvasApiCtx) {
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
      url.searchParams.append("start_date", input.search.start.toISOString());
      url.searchParams.append("end_date", input.search.end.toISOString());
      url.searchParams.append("per_page", "100");
      url.searchParams.append("locale", "en");
      // input.search.courses.forEach((course) => {
      //   url.searchParams.append("context_codes[]", `course_${course}`);
      // });
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      let data = (await query.json()) as PlannerItem[] | CanvasErrors;
      if ("errors" in data) {
        return {
          success: false,
          data: undefined,
          errors: data.errors,
        };
      }
      data = data.filter((item) => {
        if (input.search.title) {
          if (
            !item.plannable.title
              .toLowerCase()
              .includes(input.search.title.toLowerCase())
          ) {
            return false;
          }
        }
        if (input.search.description) {
          if (
            String(!item.plannable.content_details)
              .toLowerCase()
              .includes(input.search.description.toLowerCase())
          ) {
            return false;
          }
        }
        if (input.search.completed == "yes") {
          if (item.planner_override?.marked_complete) {
            return false;
          }
        } else if (input.search.completed == "no") {
          if (!item.planner_override?.marked_complete) {
            return false;
          }
        }
        // if (input.search.status.length > 0) {
        //   if (item.plannable_type == "assignment") {
        //     if (input.search.status.includes("graded")) {
        //       if (!item.plannable.content_details?.has_submitted_submissions) {
        //         return false;
        //       }
        //     }
        //     if (input.search.status.includes("submitted")) {
        //       if (!item.plannable.content_details?.has_submitted_submissions) {
        //         return false;
        //       }
        //     }
        //     if (input.search.status.includes("unsubmitted")) {
        //       if (item.plannable.content_details?.has_submitted_submissions) {
        //         return false;
        //       }
        //     }
        //   }
        // }
        return true;
      });
      data.sort((a, b) => {
        for (const sortKey of input.sort) {
          if (sortKey === "date") {
            const dateA = new Date(a.plannable_date ?? "").getTime();
            const dateB = new Date(b.plannable_date ?? "").getTime();
            if (dateA !== dateB) return dateA - dateB;
          } else if (sortKey === "course") {
            const courseA = a.course?.name?.toLowerCase() ?? "";
            const courseB = b.course?.name?.toLowerCase() ?? "";
            if (courseA !== courseB) return courseA.localeCompare(courseB);
          } else if (sortKey === "completed") {
            const completedA = a.planner_override?.marked_complete ? 1 : 0;
            const completedB = b.planner_override?.marked_complete ? 1 : 0;
            if (completedA !== completedB) return completedA - completedB;
          } else if (sortKey === "status") {
            const statusA =
              a.plannable.content_details?.submission?.workflow_state ?? "";
            const statusB =
              b.plannable.content_details?.submission?.workflow_state ?? "";
            if (statusA !== statusB) return statusA.localeCompare(statusB);
          } else if (sortKey === "title") {
            const titleA = a.plannable.title?.toLowerCase() || "";
            const titleB = b.plannable.title?.toLowerCase() || "";
            if (titleA !== titleB) return titleA.localeCompare(titleB);
          } else if (sortKey === "description") {
            const descriptionA =
              a.plannable.content_details?.description?.toLowerCase() || "";
            const descriptionB =
              b.plannable.content_details?.description?.toLowerCase() || "";
            if (descriptionA !== descriptionB)
              return descriptionA.localeCompare(descriptionB);
          }
        }
        return 0; // If all sort keys result in a tie, keep the original order
      });
      for (const item of data) {
        const courseURL = new URL(
          `/api/v1/courses/${item.course_id ?? item.plannable.course_id}`,
          ctx.user.canvas.url,
        );
        courseURL.searchParams.append("locale", "en");
        const courseQuery = await fetch(courseURL, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        item.course = (await courseQuery.json()) as Course;

        if (item.plannable_type == "assignment") {
          const assignmentURL = new URL(
            `/api/v1/courses/${item.course_id}/assignments/${item.plannable.id}`,
            ctx.user.canvas.url,
          );
          assignmentURL.searchParams.append("include[]", "submission");
          assignmentURL.searchParams.append("locale", "en");
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

    return await unstable_cache(
      todoList,
      [
        `user_${ctx.user.get?.id}:todo:list`,
        `user_${ctx.user.get?.id}:todo:list@${[
          ...Object.entries(input)
            .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
            .sort((a, b) => a.localeCompare(b)),
        ].join(",")}`,
      ],
      {
        revalidate: 60 * 5,
        tags: [`user_${ctx.user.get?.id}:todo:list`],
      },
    )();
  };
}
