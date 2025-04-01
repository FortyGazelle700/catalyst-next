"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CanvasErrors, PlannerNote } from "@/server/api/canvas/types";
import { useEffect, useState } from "react";
import { TodoItemRenderer } from "./client.page";

export default function TodoItemModalPage({ id }: { id: number }) {
  const [response, setResponse] = useState<
    {
      success: boolean;
      data: PlannerNote | undefined;
    } & CanvasErrors
  >({
    success: true,
    data: undefined,
    errors: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const req = await fetch(`/api/todo/get-note/${id}`);
      const res = await req.json();
      setResponse(res);
    };

    fetchData();
  }, [id]);

  if (!response?.success) {
    return (
      <div className="px-8 pt-8 pb-16 flex flex-col gap-2">
        <h1 className="h1">Todo Item Not Found</h1>
        <p>
          You either don't have access to view this resource, or it doesn't
          exist
        </p>
      </div>
    );
  }

  if (!response?.data) {
    return (
      <div className="px-8 pt-8 pb-16 flex flex-col gap-2">
        <h1 className="h1">
          <Skeleton className="h-[1em] w-[20ch] rounded-full" />
        </h1>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[1rem] w-[80ch] rounded-full" />
          <Skeleton className="h-[1rem] w-[80ch] rounded-full" />
          <Skeleton className="h-[1rem] w-[80ch] rounded-full" />
          <Skeleton className="h-[1rem] w-[30ch] rounded-full" />
        </div>
        <Skeleton className="h-10 w-18 rounded-full fixed bottom-0 right-0 m-4" />
      </div>
    );
  }

  return (
    <div className="px-8 pt-8 pb-16 flex flex-col gap-2">
      <TodoItemRenderer todoItem={response.data!} />
    </div>
  );
}
