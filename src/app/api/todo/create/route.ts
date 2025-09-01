import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const TodoSchema = z.object({
  title: z.string(),
  description: z.string(),
  due_at: z.string(),
  course_id: z.number(),
});

export const POST = auth(async (req) => {
  const body = (await req.json()) as z.infer<typeof TodoSchema>;
  const parsed = TodoSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        data: [],
        errors: parsed.error.errors.map((err) => ({
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
    await api({
      session: req.auth,
    })
  ).canvas.todo.create(parsed.data);

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
