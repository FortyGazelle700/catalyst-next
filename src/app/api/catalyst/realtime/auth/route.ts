import { auth } from "@/server/auth";
import { api } from "@/server/api";

import Pusher from "pusher";

export const POST = auth(async (req) => {
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

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ?? "",
    key: process.env.PUSHER_APP_KEY ?? "",
    host: process.env.NEXT_PUBLIC_PUSHER_HOST ?? "",
    secret: process.env.PUSHER_APP_KEY_SECRET ?? "",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu",
    useTLS: true,
  });

  const ctx = await (
    await api({
      session: req.auth,
    })
  ).catalyst.getCtx();

  // console.log({
  //   appId: process.env.PUSHER_APP_ID ?? "",
  //   key: process.env.PUSHER_APP_KEY ?? "",
  //   host: process.env.NEXT_PUBLIC_PUSHER_HOST ?? "",
  //   secret: process.env.PUSHER_APP_KEY_SECRET ?? "",
  //   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu",
  //   useTLS: true,
  // });

  return Response.json(
    pusher.authenticateUser(
      String((await req.formData()).get("socket_id") as string),
      {
        id: ctx.user.get?.id ?? `unknown-${Date.now()}`,
      },
    ),
    {
      status: 200,
    },
  );
});
