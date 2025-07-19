import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const TodoSchema = z.object({
  title: z.string(),
  description: z.string(),
  due_at: z.string(),
  course_id: z.number(),
});

export const PUT = auth(async (req, ctx) => {
  const param = (await ctx.params) as { id: string } | undefined;
  const body = (await req.json()) as z.infer<typeof TodoSchema>;

  const parsedBody = TodoSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      {
        success: false,
        data: [],
        errors: parsedBody.error.errors.map((err) => ({
          message: err.message,
          path: err.path,
        })),
      },
      {
        status: 400,
      },
    );
  }

  const response = await (
    await api({})
  ).canvas.todo.edit({
    id: Number(param?.id),
    ...parsedBody.data,
  });

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
