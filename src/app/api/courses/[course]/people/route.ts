import { api } from "@/server/api";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ course: string }> }
) => {
  const course = (await params).course;
  const response = await (
    await api({})
  ).canvas.courses.people({
    courseId: Number(course),
    useCache: true,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
