import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req, ctx) => {
  const body = ctx.params;

  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.todo.getNote({
    id: Number(body?.id),
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
}) as any;
