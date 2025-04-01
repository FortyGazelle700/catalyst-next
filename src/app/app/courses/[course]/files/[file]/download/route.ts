import { api } from "@/server/api";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const ctx = await (await api({})).canvas.getCtx();

  const fileDetails = (await (
    await fetch(
      new URL(
        new URL(req.url).pathname
          .replace("/app/", "/api/v1/")
          .replace("/download", ""),
        ctx.user.canvas.url
      ),
      {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token ?? ""}`,
        },
      }
    )
  ).json()) as { url: string };

  const file = await (
    await fetch(fileDetails.url, {
      headers: {
        Authorization: `Bearer ${ctx.user.canvas.token ?? ""}`,
      },
    })
  ).blob();

  return new Response(file);
}
