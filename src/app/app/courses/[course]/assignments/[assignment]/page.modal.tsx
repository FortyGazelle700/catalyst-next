"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { LocaleDateTimeString } from "@/components/util/format-date-client";
import { type Assignment, type CanvasErrors } from "@/server/api/canvas/types";
import { Info } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export function AssignmentDialogPage({
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

  const prettyBody = useCallback((str?: string) => {
    if (!str) return "";
    str = str.replace(/<script.*?<\/script>/g, "");
    return replaceCanvasURL(str);
  }, []);

  function replaceCanvasURL(str: string) {
    const baseURL = `${
      process.env.PUBLISH_URL ?? "http://localhost:3000"
    }/app/`;
    const pattern =
      /https:\/\/[a-zA-Z0-9.-]+\.instructure\.com\/(?:api\/v1\/)?/g;
    return str.split(pattern).join(baseURL);
  }

  const renderer = useMemo(
    () => (
      <>
        <h1 className="h1">{response.data?.name}</h1>
        {response.data?.locked_for_user && (
          <div className="mb-4 flex items-center gap-1 rounded-md bg-yellow-50 p-4 text-xs text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
            <Info className="size-3" />
            This assignment is currently locked. (
            {(() => {
              if (
                new Date(response.data?.unlock_at ?? "").getTime() >= Date.now()
              ) {
                return (
                  <>
                    Unlocks{" "}
                    <LocaleDateTimeString
                      date={response.data?.unlock_at ?? ""}
                      locale={undefined}
                      options={{ timeStyle: "short", dateStyle: "medium" }}
                    />
                  </>
                );
              } else if (
                new Date(response.data?.lock_at ?? "").getTime() <= Date.now()
              ) {
                return (
                  <>
                    Locked{" "}
                    <LocaleDateTimeString
                      date={response.data?.lock_at ?? ""}
                      locale={undefined}
                      options={{ timeStyle: "short", dateStyle: "medium" }}
                    />
                  </>
                );
              } else {
                return "No lock information";
              }
            })()}
            )
          </div>
        )}
        <div
          className="render-fancy"
          dangerouslySetInnerHTML={{
            __html: prettyBody(response.data?.description),
          }}
        />
      </>
    ),
    [prettyBody, response],
  );

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

  return renderer;
}
