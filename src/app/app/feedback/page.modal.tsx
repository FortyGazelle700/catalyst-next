"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const FeedbackModalPage = dynamic(
  async () => (await import("./client.page")).FeedbackRenderer,
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-16 w-[24ch]" />
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
        <Skeleton className="h-24" />
        <Skeleton className="h-10 ml-auto w-[10ch]" />
      </div>
    ),
  }
);

export default FeedbackModalPage;
