import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req, ctx) => {
  const params = (await ctx.params) as { course?: string } | undefined;
  const course = params?.course;
  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.courses.frontPage({
    courseId: Number(course),
    useCache: true,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
