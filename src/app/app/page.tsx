import { ElementAnimate, TextAnimate } from "@/components/magicui/text-animate";
import { ArrowRight, ArrowUpRight, Logs } from "lucide-react";
import { auth } from "@/server/auth";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MissingCard } from "./page.client";
import { Skeleton } from "@/components/ui/skeleton";
import { type Metadata } from "next";

import { TimeCard, MiniTodoList, CourseList } from "./page.dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-x-hidden px-8 py-16">
      <h1 className="h1">
        <TextAnimate>
          {`Hiya, ${session?.user?.name?.split(" ").at(0) ?? "User"}!`}
        </TextAnimate>
      </h1>
      <ElementAnimate delay={400} className="@container w-full">
        <h2 className="h3 text-muted-foreground">Overview</h2>
        <div className="flex h-auto flex-col gap-2 py-4 @3xl:flex-row">
          <TimeCard />
          <Suspense fallback={<Skeleton className="h-52 w-96 rounded-xs" />}>
            <MissingCard />
          </Suspense>
          <Suspense
            fallback={
              <Skeleton className="h-52 w-96 rounded-t-xs rounded-b-md @3xl:rounded-l-xs @3xl:rounded-r-md" />
            }
          >
            <div className="stack group relative h-36 overflow-hidden rounded-t-xs rounded-b-md border @3xl:h-52 @3xl:flex-1 @3xl:rounded-l-xs @3xl:rounded-r-md">
              <div className="flex flex-col justify-end p-4 transition-all group-hover:scale-90 group-hover:opacity-0">
                <h3 className="text-muted-foreground text-lg">Messages</h3>
                <h4 className="text-4xl font-bold">0</h4>
                <Button
                  variant="outline"
                  href="/app/social/chats/canvas"
                  size="icon"
                  className="absolute top-4 right-4 grid"
                >
                  <ArrowUpRight />
                </Button>
              </div>
              <Link
                href="/app/social/chats/canvas"
                className="bg-secondary pointer-events-none absolute inset-0 grid scale-150 place-items-center opacity-0 transition-all group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
              >
                <ArrowRight className="transition-all group-hover:-rotate-45" />
              </Link>
            </div>
          </Suspense>
        </div>
      </ElementAnimate>
      <ElementAnimate delay={500} className="w-full">
        <h2 className="h3 text-muted-foreground">Courses</h2>
        <div className="-mx-8 flex gap-4 overflow-auto px-8 py-4">
          <CourseList />
          <Button
            variant="outline"
            href="/app/courses"
            className="flex h-40 w-96 shrink-0 flex-col items-start justify-end gap-2 overflow-hidden rounded-xs p-4 text-sm transition-all hover:scale-105 hover:shadow-2xl"
          >
            <Logs className="size-6" />
            View All Courses
          </Button>
        </div>
      </ElementAnimate>
      <ElementAnimate delay={600} className="w-full">
        <MiniTodoList />
      </ElementAnimate>
    </div>
  );
}
