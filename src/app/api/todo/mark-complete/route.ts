import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const MarkCompleteSchema = z.object({
  id: z.number(),
  complete: z.boolean(),
});

export const PUT = auth(async (req) => {
  const body = (await req.json()) as z.infer<typeof MarkCompleteSchema>;

  const parseResult = MarkCompleteSchema.safeParse(body);
  if (!parseResult.success) {
    return Response.json(
      {
        success: false,
        data: [],
        errors: parseResult.error.errors.map((err) => ({
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
  ).canvas.todo.markComplete(parseResult.data);

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
