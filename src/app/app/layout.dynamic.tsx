"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

export const CoursesGroupClient = dynamic(
  () =>
    import("./layout.client").then(({ CoursesGroupClient }) => ({
      default: CoursesGroupClient,
    })),
  {
    ssr: false,
    loading: () =>
      Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-12" />
      )),
  }
);
