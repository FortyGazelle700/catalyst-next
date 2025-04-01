import { api } from "@/server/api";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ course: string; assignment: string }> }
) => {
  const course = (await params).course;
  const assignment = (await params).assignment;
  const data = await req.json();
  const response = await (
    await api({})
  ).canvas.courses.assignments.submissions.submit.text({
    courseId: Number(course),
    assignmentId: Number(assignment),
    body: data.body,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
