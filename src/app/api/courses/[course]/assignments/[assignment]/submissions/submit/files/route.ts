import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const POST = auth(async (req, ctx) => {
  const course = ctx.params?.course;
  const assignment = ctx.params?.assignment;
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
    await api({
      session: req.auth,
    })
  ).canvas.courses.assignments.submissions.submit.files({
    courseId: Number(course),
    assignmentId: Number(assignment),
    files: files,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
}) as any;
