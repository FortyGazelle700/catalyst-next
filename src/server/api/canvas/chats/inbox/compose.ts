"use server";

import type { CanvasApiCtx } from "../..";
import type { CanvasErrors, ConversationDetailed } from "../../types";

export type InboxInput = {
  subject?: string;
  participants: number[];
  context?: number;
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

    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/app/social/chats/canvas/compose`);

    const url = new URL("/api/v1/conversations/", ctx.user.canvas.url);
    const query = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ctx.user.canvas.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: input.subject,
        body: input.body,
        context_code: input.context,
        recipients: input.participants,
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
