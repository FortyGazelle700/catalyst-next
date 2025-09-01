import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req) => {
  const response = await (
    await api({
      session: req.auth,
    })
  ).catalyst.schools.find({
    query: req.nextUrl.searchParams.get("query") ?? "",
  });
  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
