"use server";

import type { CanvasApiCtx } from ".";

export default async function verify(ctx: CanvasApiCtx) {
  return async (input: { token: string }) => {
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
    const url = new URL(`/api/v1/accounts`, ctx.user.canvas.url);
    url.searchParams.set('locale', 'en');
    const query = await fetch(url, {
      headers: {
        Authorization: `Bearer ${input.token ?? ctx.user.canvas.token}`,
      },
    });
    return {
      success: query.ok,
      data: {
        success: query.ok,
      },
      errors: [],
    };
  };
}
