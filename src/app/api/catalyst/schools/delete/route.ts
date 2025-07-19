import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const DELETE = auth(async (req) => {
  const response = await (
    await api({
      session: req.auth,
    })
  ).catalyst.schools.delete({
    id: req.nextUrl.searchParams.get("id") ?? "",
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
