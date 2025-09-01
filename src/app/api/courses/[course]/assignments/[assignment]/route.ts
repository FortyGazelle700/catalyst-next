import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req, ctx) => {
  const params = (await ctx.params) as
    | { course: string; assignment: string }
    | undefined;
  const course = params?.course;
  const assignment = params?.assignment;
  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.courses.assignments.get({
    courseId: Number(course),
    assignmentId: Number(assignment),
    useCache: true,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
