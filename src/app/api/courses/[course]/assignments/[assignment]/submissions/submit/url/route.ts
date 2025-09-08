import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const paramsSchema = z.object({
  course: z.string().optional(),
  assignment: z.string().optional(),
});

const dataSchema = z.object({
  body: z.string(),
});

export const POST = auth(async (req, ctx) => {
  const paramsParseResult = paramsSchema.safeParse(await ctx.params);
  if (!paramsParseResult.success) {
    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { course, assignment } = paramsParseResult.data;

  const dataParseResult = dataSchema.safeParse(await req.json());
  if (!dataParseResult.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { body } = dataParseResult.data;

  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.courses.assignments.submissions.submit.url({
    courseId: Number(course),
    assignmentId: Number(assignment),
    body,
  });

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
