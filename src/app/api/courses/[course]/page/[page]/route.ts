import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req, ctx) => {
  const course = ctx.params?.course;
  const page = String(ctx.params?.page);
  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.courses.page({
    courseId: Number(course),
    pageId: page,
    useCache: true,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
}) as any;
