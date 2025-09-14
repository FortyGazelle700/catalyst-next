import { Skeleton } from "@/components/ui/skeleton";

export default function SchoolLoading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-12 w-[24ch]" />
      <Skeleton className="h-36" />
      <Skeleton className="h-56" />
      <Skeleton className="h-36" />
      <Skeleton className="ml-auto h-10 w-[10ch]" />
    </div>
  );
}
