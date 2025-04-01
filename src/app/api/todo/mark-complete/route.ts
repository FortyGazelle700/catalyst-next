import { api } from "@/server/api";

export const PUT = async (req: Request) => {
  const body = await req.json();

  if (typeof body?.id !== "number" || typeof body?.complete !== "boolean") {
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
  ).canvas.todo.markComplete({
    id: body?.id,
    complete: body?.complete,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
