import { api } from "@/server/api";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const body = await params;

  const response = await (
    await api({})
  ).canvas.todo.getNote({
    id: Number(body?.id),
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
