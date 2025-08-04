import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats",
};

export default function ChatsPage() {
  return (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center p-24 text-xs">
      No thread selected
    </div>
  );
}
