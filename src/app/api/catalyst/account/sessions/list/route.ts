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

  const sessions = await (
    await api({
      session: req.auth,
    })
  ).catalyst.account.sessions.list();

  return Response.json(sessions, {
    status: 200,
  });
});
