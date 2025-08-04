import { type Metadata } from "next";
import { TodoClientPage } from "./page.client";

export const metadata: Metadata = {
  title: "Todo List",
};

export default function TodoPage() {
  return <TodoClientPage />;
}
