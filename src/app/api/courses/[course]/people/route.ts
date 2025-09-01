import { auth } from "@/server/auth";
import { api } from "@/server/api";
import z from "zod";

const PeopleListSchema = z.object({
  cursor: z.string().optional(),
  limit: z.string().optional(),
});

export const GET = auth(async (req, ctx) => {
  const { data: body, error } = PeopleListSchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams.entries()),
  );

  if (error) {
    return Response.json(
      { error: "Invalid request body", details: error.errors },
      { status: 400 },
    );
  }

  const params = (await ctx.params) as { course?: string } | undefined;
  const course = params?.course;
  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.courses.people({
    courseId: Number(course),
    useCache: true,
    limit: body.limit ? Number(body.limit) : undefined,
    cursor: body.cursor ? Number(body.cursor) : undefined,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
