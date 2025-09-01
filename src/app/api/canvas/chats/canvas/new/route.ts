import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const ChatListSchema = z.object({
  subject: z.string(),
  context: z.number().optional(),
  participants: z.array(z.number()).min(1),
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
  ).canvas.chats.inbox.compose({
    body: body.body,
    subject: body.subject,
    context: body.context,
    participants: body.participants,
  });

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
