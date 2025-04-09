import { api } from "@/server/api";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ course: string; assignment: string }> }
) => {
  const course = (await params).course;
  const assignment = (await params).assignment;
  const json = await req.json();
  const filesURLS = json.fileURLS as string[];

  const files = await Promise.all(
    filesURLS.map(async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], url.split("/").pop() || "file", {
        type: blob.type,
      });
      return file;
    })
  );

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
