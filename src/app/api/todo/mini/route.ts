import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req) => {
  console.log("req", req.auth?.user?.name);
  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.todo.mini({});
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
}) as any;
