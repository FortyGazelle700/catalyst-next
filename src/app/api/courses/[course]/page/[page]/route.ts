import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req, ctx) => {
  const params = (await ctx.params) as
    | { course?: string; page?: string }
    | undefined;
  const course = params?.course;
  const page = String(params?.page);
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
});
