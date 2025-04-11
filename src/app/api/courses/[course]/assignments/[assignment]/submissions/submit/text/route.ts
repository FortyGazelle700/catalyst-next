import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const POST = auth(async (req, ctx) => {
  const course = ctx.params?.course;
  const assignment = ctx.params?.assignment;
  const data = await req.json();
  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.courses.assignments.submissions.submit.text({
    courseId: Number(course),
    assignmentId: Number(assignment),
    body: data.body,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
}) as any;
