"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";

export const TextEditor = dynamic(
  () => import("./editor").then((mod) => mod.TextEditor),
  {
    ssr: false,
    loading: () => <Skeleton className="h-44" />,
  }
);
