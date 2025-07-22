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

  const ctx = await (
    await api({
      session: req.auth,
    })
  ).canvas.getCtx();

  const settings = ctx.user.settings;

  settings.canvas_token = undefined!;

  return Response.json(
    {
      success: true,
      errors: [],
      data: settings,
    },
    {
      status: 200,
    },
  );
});
