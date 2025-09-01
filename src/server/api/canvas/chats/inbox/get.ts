"use server";

import type { CanvasApiCtx } from "../..";
import type { CanvasErrors, ConversationDetailed } from "../../types";

export type InboxInput = {
  id: number;
};

export default async function inbox(ctx: CanvasApiCtx) {
  return async (input: InboxInput) => {
    const { unstable_cache } = await import("next/cache");

    const inbox = async () => {
      if (!ctx.user.canvas.url || !ctx.user.canvas.token) {
        return {
          success: false,
          data: undefined as ConversationDetailed | undefined,
          errors: [
            {
              message: "Canvas URL or token not found",
            },
          ],
        };
      }
      const url = new URL(
        `/api/v1/conversations/${input.id}`,
        ctx.user.canvas.url,
      );
      url.searchParams.append("include_private", "true");
      url.searchParams.append("include", "participants");
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as ConversationDetailed | CanvasErrors;
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
        `user_${ctx.user.get?.id}:social:chats:inbox:item`,
        `user_${ctx.user.get?.id}:social:chats:inbox:item@${[
          ...Object.entries(input)
            .map(([k, v]) => `${k}=${v}`)
            .sort((a, b) => a.localeCompare(b)),
        ].join(",")}`,
      ],
      {
        revalidate: 1000 * 60 * 5,
        tags: [
          `user_${ctx.user.get?.id}:social:chats:inbox:item`,
          `user_${ctx.user.get?.id}:social:chats:inbox:item@${[
            ...Object.entries(input)
              .map(([k, v]) => `${k}=${v}`)
              .sort((a, b) => a.localeCompare(b)),
          ].join(",")}`,
        ],
      },
    )();
  };
}
