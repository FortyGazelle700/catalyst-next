import { api } from "@/server/api";
import { unstable_cache } from "next/cache";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const ctx = await (await api({})).canvas.getCtx();

  const url = new URL(
    new URL(req.url).pathname
      .replace("/app/", "/api/v1/")
      .replace("/preview", ""),
    ctx.user.canvas.url
  );

  const fileDetails = await unstable_cache(
    async () =>
      (await (
        await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token ?? ""}`,
          },
        })
      ).json()) as { url: string },
    [url.toString()]
  )();

  const file = await (
    await fetch(fileDetails.url, {
      headers: {
        Authorization: `Bearer ${ctx.user.canvas.token ?? ""}`,
      },
    })
  ).blob();

  return new Response(file);
}
