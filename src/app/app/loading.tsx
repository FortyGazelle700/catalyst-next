import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-12 w-[24ch]" />
      <Skeleton className="h-36" />
      <Skeleton className="h-56" />
      <Skeleton className="h-36" />
      <Skeleton className="h-10 ml-auto w-[10ch]" />
    </div>
  );
}
