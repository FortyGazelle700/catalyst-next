import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const ParamsSchema = z.object({
  course: z.string().optional(),
  assignment: z.string().optional(),
});

const RequestBodySchema = z.object({
  fileURLS: z.array(z.string()),
});

export const POST = auth(async (req, ctx) => {
  const paramsParseResult = ParamsSchema.safeParse(ctx.params);
  if (!paramsParseResult.success) {
    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  }
  const { course, assignment } = paramsParseResult.data;

  const json = (await req.json()) as z.infer<typeof RequestBodySchema>;
  const bodyParseResult = RequestBodySchema.safeParse(json);
  if (!bodyParseResult.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { fileURLS } = bodyParseResult.data;

  const files = await Promise.all(
    fileURLS.map(async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], url.split("/").pop() ?? "file", {
        type: blob.type,
      });
      return file;
    }),
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
});
