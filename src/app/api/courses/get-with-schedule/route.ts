import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req) => {
  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.courses.getWithSchedule({});
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
