"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const SettingsClientRenderer = dynamic(() => import("./page.client"), {
  ssr: false,
  loading: () => (
    <div className="@container -mx-4 -my-8 flex h-[calc(100%+theme(spacing.12))] max-h-136 w-[calc(100%+theme(spacing.8))]">
      <div className="flex w-full flex-col gap-4">
        <Skeleton className="h-36 w-[50ch] rounded-md" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex w-full max-w-md flex-col gap-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ))}
      </div>
      <Skeleton className="h-full w-80" />
    </div>
  ),
});

export default SettingsClientRenderer;
