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

  const response = await (
    await api({
      session: req.auth,
    })
  ).catalyst.account.settings.listPeriods();

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
