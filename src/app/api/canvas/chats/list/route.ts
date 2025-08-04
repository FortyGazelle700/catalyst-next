import { auth } from "@/server/auth";
import { api } from "@/server/api";
import { z } from "zod";

const ChatListSchema = z.object({
  cursor: z.string().optional(),
  limit: z.string().optional(),
});

export const GET = auth(async (req) => {
  const { data: body, error } = ChatListSchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams.entries()),
  );

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
  ).canvas.chats.list({
    limit: body.limit ? Number(body.limit) : undefined,
    cursor: body.cursor ? Number(body.cursor) : undefined,
  });

  return Response.json(response, {
    status: response.success ? 200 : 400,
  });
});
