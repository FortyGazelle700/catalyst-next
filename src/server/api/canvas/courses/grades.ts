"use server";

import type { CanvasApiCtx } from "..";
import type { Assignment, AssignmentGroup, CanvasErrors } from "../types";

export type GradesInput = {
  courseId: number;
  useCache?: boolean;
};

export type GradesResponse = {
  assignments: Assignment[];
  groups: AssignmentGroup[];
};

export default async function grades(ctx: CanvasApiCtx) {
  return async (input: GradesInput) => {
    const { unstable_cache } = await import("next/cache");

    const grades = async () => {
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
      const assignments = async () => {
        const url = new URL(
          `/api/v1/courses/${input.courseId}/assignments`,
          ctx.user.canvas.url,
        );
        url.searchParams.append("per_page", "1000");
        url.searchParams.append("include[]", "submission");
        url.searchParams.append("include[]", "score_statistics");
        url.searchParams.append("locale", "en");
        const query = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });

        const data = (await query.json()) as Assignment[] | CanvasErrors;

        if ("errors" in data) {
          return {
            success: false,
            data: [],
            errors: data.errors,
          };
        }
        return {
          success: true,
          data: data,
          errors: [],
        };
      };
      const groups = async () => {
        const url = new URL(
          `/api/v1/courses/${input.courseId}/assignment_groups`,
          ctx.user.canvas.url,
        );
        url.searchParams.append("locale", "en");
        const query = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });

        const data = (await query.json()) as AssignmentGroup[] | CanvasErrors;

        if ("errors" in data) {
          return {
            success: false,
            data: [],
            errors: data.errors,
          };
        }
        return {
          success: true,
          data: data,
          errors: [],
        };
      };

      const [assignmentsResponse, groupsResponse] = await Promise.all([
        assignments(),
        groups(),
      ]);

      if (!assignmentsResponse.success || !groupsResponse.success) {
        return {
          success: false,
          data: undefined,
          errors: [
            ...(assignmentsResponse.errors ?? []),
            ...(groupsResponse.errors ?? []),
          ],
        };
      }

      const assignmentsData = assignmentsResponse.data;
      const groupsData = groupsResponse.data;

      return {
        success: true,
        data: { assignments: assignmentsData, groups: groupsData },
        errors: [],
      };
    };

    if (input?.useCache ?? true) {
      return await unstable_cache(
        grades,
        [
          `user_${ctx.user.get?.id}:course:grades`,
          `user_${ctx.user.get?.id}:course:grades@${[
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(",")}`,
        ],
        {
          revalidate: 60,
          tags: [
            `user_${ctx.user.get?.id}:course:grades`,
            `user_${ctx.user.get?.id}:course:grades@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        },
      )();
    }
    return await grades();
  };
}
