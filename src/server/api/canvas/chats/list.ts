"use server";

import { type CanvasApiCtx } from "@/server/api/canvas";
import inbox from "./inbox/list";

export type ChatsInput = {
  limit?: number;
  cursor?: number;
};

export default async function list(ctx: CanvasApiCtx) {
  return async (input: ChatsInput) => {
    const inboxData = await (await inbox(ctx))(input);
    return {
      success: inboxData.success,
      data: [...(inboxData.data ?? [])],
      errors: [...inboxData.errors],
    };
  };
}
