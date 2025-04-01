import { api } from "@/server/api";

export const GET = async (req: Request) => {
  const response = await (
    await api({})
  ).canvas.courses.list({
    enrollmentState: "active",
    limit: 100,
    offset: 1,
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
};
