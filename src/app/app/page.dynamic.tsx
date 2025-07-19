"use client";

import { Skeleton } from "@/components/ui/skeleton";

import dynamic from "next/dynamic";

export const TimeCard = dynamic(
  () => import("./page.client").then(({ TimeCard }) => ({ default: TimeCard })),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="relative flex-auto @3xl:flex-1 border stack h-52 @3xl:h-52 rounded-t-md rounded-b-xs @3xl:rounded-l-md @3xl:rounded-r-xs group overflow-hidden" />
    ),
  }
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
        <Skeleton key={idx} className="w-96 h-40 rounded-xs flex-shrink-0" />
      )),
  }
);

export const MiniTodoList = dynamic(
  () =>
    import("./page.client").then(({ MiniTodoList }) => ({
      default: MiniTodoList,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="w-96 h-52 rounded-xs" />,
  }
);
