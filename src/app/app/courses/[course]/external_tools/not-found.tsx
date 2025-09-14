import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-background text-muted-foreground fixed inset-0 z-10 flex h-full w-full items-center justify-center gap-2">
      <Loader className="size-3 animate-spin" />
      <span>Loading...</span>
    </div>
  );
}
