import { Metadata } from "next";
import { FeedbackRenderer } from "./client.page";

const metadata: Metadata = {
  title: "Create Todo Item",
  description: "Create a new todo item",
};

export default async function FeedbackPage() {
  return (
    <div className="px-8 py-16 flex flex-col gap-2">
      <FeedbackRenderer />
    </div>
  );
}
