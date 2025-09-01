import { ChatsClientPage } from "./page.client";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatsClientPage>{children}</ChatsClientPage>;
}
