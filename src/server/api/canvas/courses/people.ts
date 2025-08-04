"use server";

import type { CanvasApiCtx } from "..";
import type { CanvasErrors, User } from "../types";

export type PeopleInput = {
  courseId: number;
  useCache?: boolean;
  limit?: number;
  cursor?: number;
};

export default async function getPeople(ctx: CanvasApiCtx) {
  return async (input: PeopleInput) => {
    const { unstable_cache } = await import("next/cache");

    const people = async () => {
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
      const url = new URL(
        `/api/v1/courses/${input.courseId}/users`,
        ctx.user.canvas.url,
      );
      url.searchParams.append("include[]", "avatar_url");
      url.searchParams.append("include[]", "enrollments");
      url.searchParams.append("include[]", "communication_channel");
      url.searchParams.append("per_page", String(input?.limit ?? 100));
      url.searchParams.append("page", String(input?.cursor ?? 1));
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as User[] | CanvasErrors;
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
    };

    if (input?.useCache ?? true) {
      return await unstable_cache(
        people,
        [
          `user_${ctx.user.get?.id}:course:people`,
          `user_${ctx.user.get?.id}:course:people@${[
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(",")}`,
        ],
        {
          revalidate: 60,
          tags: [
            `user_${ctx.user.get?.id}:course:people`,
            `user_${ctx.user.get?.id}:course:people@${[
              ...Object.entries(input)
                .map(([k, v]) => `${k}=${v}`)
                .sort((a, b) => a.localeCompare(b)),
            ].join(",")}`,
          ],
        },
      )();
    }
    return await people();
  };
}
