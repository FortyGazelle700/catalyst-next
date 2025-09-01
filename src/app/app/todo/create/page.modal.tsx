"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const CreateTodoItemModalPage = dynamic(
  async () => (await import("./client.page")).CreateTodoItemRenderer,
  {
    ssr: false,
    loading: () => (
      <>
        <Skeleton className="h-16 w-[24ch]" />
        <Skeleton className="h-10" />
        <Skeleton className="h-44" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10 ml-auto w-[10ch]" />
      </>
    ),
  }
);

export default CreateTodoItemModalPage;
