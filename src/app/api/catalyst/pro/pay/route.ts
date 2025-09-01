import { auth } from "@/server/auth";
import { api } from "@/server/api";

export const GET = auth(async (req) => {
  if (!req.auth) {
    return Response.json(
      {
        success: false,
        errors: [{ message: "Unauthorized" }],
        data: null,
      },
      { status: 400 },
    );
  }

  const pay = await (
    await api({
      session: req.auth,
    })
  ).catalyst.pro.pay({
    priceId: String(req.nextUrl.searchParams.get("id") ?? ""),
  });

  return Response.json(pay, {
    status: 200,
  });
});
