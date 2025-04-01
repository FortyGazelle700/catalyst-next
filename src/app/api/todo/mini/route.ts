import { api } from "@/server/api";

export const GET = async (req: Request) => {
  const response = await (await api({})).canvas.todo.mini({});
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
