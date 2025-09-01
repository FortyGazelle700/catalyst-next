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
  ).catalyst.getCtx();

  return Response.json(
    {
      success: true,
      data: {
        channelId: `user-${ctx.user.get?.id}`,
        realtimeSecret: ctx.user.get?.realtimeSecret,
      },
      errors: [],
    },
    {
      status: 200,
    },
  );
});
