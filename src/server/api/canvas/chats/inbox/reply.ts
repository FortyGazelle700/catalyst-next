"use server";

import type { CanvasApiCtx } from "../..";
import type { CanvasErrors, ConversationDetailed } from "../../types";

export type InboxInput = {
  id: number;
  body: string;
};

export default async function reply(ctx: CanvasApiCtx) {
  return async (input: InboxInput) => {
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

    const { revalidatePath, revalidateTag } = await import("next/cache");
    revalidatePath(`/app/social/chats/canvas/${input.id}`);
    revalidateTag(
      `user_${ctx.user.get?.id}:social:chats:inbox:item@id=${input.id}`,
    );

    const url = new URL(
      `/api/v1/conversations/${input.id}/add_message`,
      ctx.user.canvas.url,
    );
    url.searchParams.append("locale", "en");
    const query = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ctx.user.canvas.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: input.body,
      }),
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
}
