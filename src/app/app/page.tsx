import { ElementAnimate, TextAnimate } from "@/components/magicui/text-animate";
import { ArrowRight, ArrowUpRight, Logs } from "lucide-react";
import { auth } from "@/server/auth";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseList, MiniTodoList, MissingCard, TimeCard } from "./page.client";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-col py-16 px-8 overflow-x-hidden flex-1 gap-4">
      <h1 className="h1">
        <TextAnimate>
          {`Hiya, ${session?.user?.name?.split(" ").at(0) ?? "User"}!`}
        </TextAnimate>
      </h1>
      <ElementAnimate delay={400} className="w-full @container">
        <h2 className="h3 text-muted-foreground">Overview</h2>
        <div className="py-4 flex gap-2 @3xl:flex-row flex-col h-auto">
          <Suspense
            fallback={
              <Skeleton className="w-96 h-52 rounded-t-md rounded-b-xs @3xl:rounded-l-md @3xl:rounded-r-xs" />
            }
          >
            <TimeCard />
          </Suspense>
          <Suspense fallback={<Skeleton className="w-96 h-52 rounded-xs" />}>
            <MissingCard />
          </Suspense>
          <Suspense
            fallback={
              <Skeleton className="w-96 h-52 rounded-t-xs rounded-b-md @3xl:rounded-l-xs @3xl:rounded-r-md" />
            }
          >
            <div className="relative flex-1 border stack h-52 rounded-t-xs rounded-b-md @3xl:rounded-l-xs @3xl:rounded-r-md group overflow-hidden">
              <div className="flex flex-col p-4 justify-end group-hover:scale-90 group-hover:opacity-0 transition-all">
                <h3 className="text-lg text-muted-foreground">Messages</h3>
                <h4 className="text-4xl font-bold">0</h4>
                <Button
                  variant="outline"
                  href="/app/social/inbox"
                  size="icon"
                  className="grid absolute right-4 top-4"
                >
                  <ArrowUpRight />
                </Button>
              </div>
              <Link
                href="/app/social/inbox"
                className="grid place-items-center bg-secondary opacity-0 group-hover:opacity-100 absolute scale-150 inset-0 transition-all group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto"
              >
                <ArrowRight className="group-hover:-rotate-45 transition-all" />
              </Link>
            </div>
          </Suspense>
        </div>
      </ElementAnimate>
      <ElementAnimate delay={500} className="w-full">
        <h2 className="h3 text-muted-foreground">Courses</h2>
        <div className="-mx-8 px-8 flex gap-4 overflow-auto py-4">
          <Suspense
            fallback={Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="w-96 h-40 rounded-xs flex-shrink-0"
              />
            ))}
          >
            <CourseList />
          </Suspense>
          <Button
            variant="outline"
            href="/app/courses"
            className="w-96 h-40 rounded-xs flex flex-col flex-shrink-0 overflow-hidden p-4 justify-end items-start gap-2 text-sm"
          >
            <Logs className="size-6" />
            View All Courses
          </Button>
        </div>
      </ElementAnimate>
      <ElementAnimate delay={600} className="w-full">
        <h2 className="h3 text-muted-foreground">
          Upcoming Assignments and Events
        </h2>
        <MiniTodoList />
      </ElementAnimate>
    </div>
  );
}
