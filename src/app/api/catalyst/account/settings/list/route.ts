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

  const settings = await (
    await api({
      session: req.auth,
    })
  ).catalyst.account.settings.list();

  settings.data.canvas_token = undefined!;

  return Response.json(settings, {
    status: settings.success ? 200 : 400,
  });
});
