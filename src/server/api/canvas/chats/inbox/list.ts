"use server";

import type { CanvasApiCtx } from "../..";
import type { CanvasErrors, Conversation } from "../../types";

export type InboxInput = {
  limit?: number;
  cursor?: number;
};

export default async function inbox(ctx: CanvasApiCtx) {
  return async (input: InboxInput) => {
    const { unstable_cache } = await import("next/cache");

    const inbox = async () => {
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: [] as Conversation[],
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
        };
      }
      const url = new URL("/api/v1/conversations", ctx.user.canvas.url);
      url.searchParams.append("include[]", "participants");
      url.searchParams.append("per_page", String(input?.limit ?? 10));
      url.searchParams.append("page", String(input?.cursor ?? 1));
      url.searchParams.append("locale", "en");
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as Conversation[] | CanvasErrors;
      if ("errors" in data) {
        return {
          success: false,
          data: undefined,
          errors: data.errors,
        };
      }

      return {
        success: true,
        data,
        errors: [],
      };
    };

    return await unstable_cache(
      inbox,
      [
        `user_${ctx.user.get?.id}:social:chats:inbox`,
        `user_${ctx.user.get?.id}:social:chats:inbox@${[
          ...Object.entries(input)
            .map(([k, v]) => `${k}=${v}`)
            .sort((a, b) => a.localeCompare(b)),
        ].join(",")}`,
      ],
      {
        revalidate: 60 * 5,
        tags: [
          `user_${ctx.user.get?.id}:social:chats:inbox`,
          `user_${ctx.user.get?.id}:social:chats:inbox@${[
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(",")}`,
        ],
      },
    )();
  };
}
