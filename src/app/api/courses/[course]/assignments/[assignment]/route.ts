import { api } from "@/server/api";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ course: string; assignment: string }> }
) => {
  const course = (await params).course;
  const assignment = (await params).assignment;
  const response = await (
    await api({})
  ).canvas.courses.assignments.get({
    courseId: Number(course),
    assignmentId: Number(assignment),
    useCache: true,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
