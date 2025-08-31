import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req) => {
  const pricing = await (
    await api({
      session: req.auth,
    })
  ).catalyst.pro.pricing();

  return Response.json(pricing, {
    status: 200,
  });
});
