import { api } from "@/server/api";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ course: string; page: string }> }
) => {
  const course = (await params).course;
  const page = (await params).page;
  const response = await (
    await api({})
  ).canvas.courses.page({
    courseId: Number(course),
    pageId: page,
    useCache: true,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
