import { Loader } from "lucide-react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats",
};

export default function ChatsLoading() {
  return (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center gap-1 p-24 text-xs">
      <Loader className="size-5 animate-spin" />
      Loading message details...
    </div>
  );
}
