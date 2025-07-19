"use client";

import { useEffect, useState } from "react";
import { SubmissionArea } from "./page.client";
import { type Assignment, type CanvasErrors } from "@/server/api/canvas/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubmissionDialogPage({
  course,
  assignment,
}: {
  course: number;
  assignment: number;
}) {
  const [response, setResponse] = useState<
    {
      success: boolean;
      data: Assignment | undefined;
    } & CanvasErrors
  >({
    success: true,
    data: undefined,
    errors: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const req = await fetch(
        `/api/courses/${course}/assignments/${assignment}`,
      );
      const res = (await req.json()) as {
        success: boolean;
        data: Assignment | undefined;
      } & CanvasErrors;
      setResponse(res);
    };

    fetchData().catch(console.error);
  }, [course, assignment]);

  if (!response?.data) {
    return (
      <div className="flex flex-col gap-2 px-8 pt-8 pb-16">
        <h1 className="h1">
          <Skeleton className="h-[1em] w-[20ch] rounded-full" />
        </h1>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[1rem] w-[80ch] rounded-full" />
          <Skeleton className="h-[1rem] w-[80ch] rounded-full" />
          <Skeleton className="h-[1rem] w-[80ch] rounded-full" />
          <Skeleton className="h-[1rem] w-[30ch] rounded-full" />
        </div>
        <Skeleton className="fixed right-0 bottom-0 m-4 h-10 w-18 rounded-full" />
      </div>
    );
  }

  return <SubmissionArea assignment={response?.data} />;
}
