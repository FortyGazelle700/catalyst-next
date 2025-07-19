import { type Metadata } from "next";
import { CreateTodoItemRenderer } from "./client.page";

export const metadata: Metadata = {
  title: "Create Todo Item",
  description: "Create a new todo item",
};

export default async function CreateTodoItemPage() {
  return (
    <div className="flex flex-col gap-2 px-8 py-16">
      <CreateTodoItemRenderer />
    </div>
  );
}
