import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-background flex h-full w-full items-center justify-center gap-1">
      <Loader className="size-4 animate-spin" /> <span>Loading...</span>
    </div>
  );
}
