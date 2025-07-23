"use client";

import { Skeleton } from "@/components/ui/skeleton";

import dynamic from "next/dynamic";

export const TimeCard = dynamic(
  () => import("./page.client").then(({ TimeCard }) => ({ default: TimeCard })),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="stack group relative h-52 flex-auto overflow-hidden rounded-t-md rounded-b-xs border @3xl:h-52 @3xl:flex-1 @3xl:rounded-l-md @3xl:rounded-r-xs" />
    ),
  },
);

export const CourseList = dynamic(
  () =>
    import("./page.client").then(({ CourseList }) => ({
      default: CourseList,
    })),
  {
    ssr: false,
    loading: () =>
      Array.from({ length: 10 }).map((_, idx) => (
        <Skeleton key={idx} className="h-40 w-96 shrink-0 rounded-xs" />
      )),
  },
);

export const MiniTodoList = dynamic(
  () =>
    import("./page.client").then(({ MiniTodoList }) => ({
      default: MiniTodoList,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-52 w-96 rounded-xs" />,
  },
);
