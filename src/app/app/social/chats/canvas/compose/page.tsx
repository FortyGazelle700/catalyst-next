import { api } from "@/server/api";
import { type Metadata } from "next";
import ComposeClient from "./page.client";

export const metadata: Metadata = {
  title: "Chats",
};

export default async function ChatsPage() {
  const ctx = await (await api({})).canvas.getCtx();

  return (
    <ComposeClient
      name={ctx.user.canvas.data.name}
      avatar={ctx.user.canvas.data.avatar_url}
    />
  );
}
