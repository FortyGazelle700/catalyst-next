import { Metadata } from "next";
import { FeedbackRenderer } from "./client.page";
import { api } from "@/server/api";

const metadata: Metadata = {
  title: "Create Todo Item",
  description: "Create a new todo item",
};

export default async function FeedbackPage() {
  const { user } = await (await api({})).catalyst.getCtx();

  return (
    <div className="px-8 py-16 flex flex-col gap-2">
      <FeedbackRenderer email={user.get?.email ?? "{provided email}"} />
    </div>
  );
}
