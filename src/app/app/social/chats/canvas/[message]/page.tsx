import { api } from "@/server/api";
import { type Metadata } from "next";
import MessageItem from "./page.client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Chats",
};

export default async function ChatsPage({
  params,
}: {
  params: Promise<{ message: string }>;
}) {
  const { data: thread } = await (
    await api({})
  ).canvas.chats.inbox.get({
    id: Number((await params).message),
  });

  const ctx = await (await api({})).canvas.getCtx();

  if (!thread) notFound();

  return (
    <MessageItem
      message={(await params).message}
      messageDetails={thread}
      userId={ctx.user.canvas.id}
    />
  );
}
