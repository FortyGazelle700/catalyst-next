import { api } from "@/server/api";
import { notFound } from "next/navigation";
import { TodoItemRenderer } from "./client.page";
import { type Metadata } from "next";

export async function generateMetadata({
  params: paramList,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await paramList;
  const todoItem = await (
    await api({})
  ).canvas.todo.getNote({
    id: Number(params.id),
  });

  return {
    title: todoItem.data?.title,
  };
}

export default async function TodoItemPage({
  params: paramList,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramList;
  const todoItem = await (
    await api({})
  ).canvas.todo.getNote({
    id: Number(params.id),
  });

  if (!todoItem.success) {
    notFound();
  }

  return (
    <div className="px-8 py-16 flex flex-col gap-2">
      <TodoItemRenderer todoItem={todoItem.data!} />
    </div>
  );
}
