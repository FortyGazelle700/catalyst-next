import { api } from "@/server/api";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ course: string; assignment: string }> }
) => {
  const course = (await params).course;
  const assignment = (await params).assignment;
  const formData = await req.formData();
  const files = formData.getAll("files[]") as File[];
  const response = await (
    await api({})
  ).canvas.courses.assignments.submissions.submit.files({
    courseId: Number(course),
    assignmentId: Number(assignment),
    files: files,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
