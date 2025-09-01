import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const ChatListSchema = z.object({
  id: z.number(),
  body: z.string(),
});

export const POST = auth(async (req) => {
  const { data: body, error } = ChatListSchema.safeParse(await req.json());

  if (error) {
    return Response.json(
      { error: "Invalid request body", details: error.errors },
      { status: 400 },
    );
  }

  const response = await (
    await api({
      session: req.auth,
    })
  ).canvas.chats.inbox.reply({
    id: body.id,
    body: body.body,
  });

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
