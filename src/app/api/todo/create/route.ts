import { api } from "@/server/api";

export const POST = async (req: Request) => {
  const body = await req.json();

  if (
    typeof body?.title !== "string" ||
    typeof body?.description !== "string" ||
    typeof body?.due_at !== "string" ||
    typeof body?.course_id !== "number"
  ) {
    return Response.json(
      {
        success: false,
        data: [],
        errors: [
          {
            message: "Mismatched Schema",
          },
        ],
      },
      {
        status: 400,
      }
    );
  }
  const response = await (
    await api({})
  ).canvas.todo.create({
    title: body?.title,
    description: body?.description,
    due_at: body?.due_at,
    course_id: body?.course_id,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
