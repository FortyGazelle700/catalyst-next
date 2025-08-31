"use client";

import { NumberCounter } from "@/components/catalyst/number-counter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  House,
  LayoutDashboard,
  Maximize,
  Percent,
  Pin,
  Timer,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  CoursesContext,
  ScheduleContext,
  TimeContext,
} from "./layout.providers";
import { subjectColors, SubjectIcon } from "@/components/catalyst/subjects";
import { type PlannerItem } from "@/server/api/canvas/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TodoItem } from "./todo";
import { Temporal } from "@js-temporal/polyfill";
import { formatDuration } from "@/components/catalyst/format-duration";

export function TimeCard() {
  const now = useContext(TimeContext);
  const [greeting, setGreeting] = useState("Hi there, it is");

  const courses = useContext(ScheduleContext);
  const currentCourse = useMemo(() => {
    return courses?.find((course) => course.time?.activePinned);
  }, [courses]);

  useEffect(() => {
    const hours = now.getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [now]);

  const timeToStart = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentCourse?.time.start?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentCourse],
  );

  const timeLeft = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentCourse?.time.end?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentCourse],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalDuration = useMemo(
    () =>
      Temporal.Instant.from(
        currentCourse?.time.start?.toISOString() ?? now.toISOString(),
      ).until(
        Temporal.Instant.from(
          currentCourse?.time.end?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentCourse],
  );

  const hasStarted = useMemo(
    () => timeToStart.total("milliseconds") <= 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeToStart, currentCourse, now],
  );

  return (
    <div className="stack group relative h-52 flex-auto overflow-hidden rounded-t-md rounded-b-xs border @3xl:h-52 @3xl:flex-1 @3xl:rounded-l-md @3xl:rounded-r-xs">
      <div className="stack transition-all group-hover:scale-90 group-hover:opacity-0">
        <div className="animate-swap flex flex-col justify-end p-4">
          <h3 className="text-muted-foreground text-lg">{greeting},</h3>
          <h4 className="flex items-center text-4xl font-bold select-none">
            {now
              .toLocaleTimeString(undefined, {
                timeStyle: "short",
              })
              .split("")
              .map((char, idx) =>
                !new RegExp("\\d").test(char) ? (
                  <span
                    className="min-w-[0.5ch] text-center"
                    key={`time-char-${char}-${idx}`}
                  >
                    {char}
                  </span>
                ) : (
                  <NumberCounter
                    key={`time-idx-${idx}`}
                    value={Number(char)}
                    height={32}
                  />
                ),
              )}
          </h4>
        </div>
        <div className="animate-swap flex flex-col justify-end p-4 opacity-0 transition-all delay-[10s] group-hover:scale-90 group-hover:opacity-0">
          <h3 className="text-muted-foreground text-lg">
            Course {hasStarted ? "ends in" : "starts in"}
          </h3>
          <h4 className="flex items-center text-4xl font-bold select-none">
            {formatDuration(hasStarted ? timeLeft : timeToStart, {
              style: "long",
              maxUnit: "hour",
              minUnit: "second",
              maxUnits: 1,
            })
              .split("")
              .map((char, idx) =>
                !new RegExp("\\d").test(char) ? (
                  <span
                    className="min-w-[0.5ch] text-center"
                    key={`time-char-${char}-${idx}`}
                  >
                    {char}
                  </span>
                ) : (
                  <NumberCounter
                    key={`time-idx-${idx}`}
                    value={Number(char)}
                    height={32}
                  />
                ),
              )}
          </h4>
        </div>
        <Button
          variant="outline"
          href="/app/schedule/now"
          size="icon"
          className="absolute top-4 right-4 grid"
        >
          <Maximize />
        </Button>
        <div className="absolute right-7 bottom-7">
          <div className="relative flex flex-col gap-2">
            <div className="bg-muted h-2 w-2 rounded-full" />
            <div className="bg-muted h-2 w-2 rounded-full" />
            <div className="bg-foreground animate-swap-indicator absolute h-2 w-2 rounded-full" />
          </div>
        </div>
      </div>
      <Link
        href="/app/schedule/now"
        className="bg-secondary pointer-events-none absolute inset-0 grid scale-150 place-items-center opacity-0 transition-all group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
      >
        <Maximize className="transition-all group-hover:-rotate-90" />
      </Link>
    </div>
  );
}

export function MissingCard() {
  const courses = useContext(CoursesContext);
  const missingAssignments = useMemo(
    () =>
      courses.reduce((acc, course) => acc + course.data.missingAssignments, 0),
    [courses],
  );

  return (
    <div className="stack group relative h-36 flex-auto overflow-hidden rounded-xs border @3xl:h-52 @3xl:flex-1">
      <div className="flex flex-col justify-end p-4 transition-all group-hover:scale-90 group-hover:opacity-0">
        <h3 className="text-muted-foreground text-lg">Missing Assignments</h3>
        <h4 className="text-4xl font-bold">{missingAssignments}</h4>
        <Button
          variant="outline"
          href="/app/todo?search.status=missing"
          size="icon"
          className="absolute top-4 right-4 grid"
        >
          <ArrowUpRight />
        </Button>
      </div>
      <Link
        href="/app/todo?search.status=missing"
        className="bg-secondary pointer-events-none absolute inset-0 grid scale-150 place-items-center opacity-0 transition-all group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
      >
        <ArrowRight className="transition-all group-hover:-rotate-45" />
      </Link>
    </div>
  );
}

export function CourseList() {
  const courses = useContext(CoursesContext);
  const currentCourse = useMemo(
    () => courses.find((course) => course.time?.activePinned),
    [courses],
  );

  const isUpcoming = useMemo(
    () => !currentCourse?.time.active,
    [currentCourse],
  );

  return (
    <>
      {currentCourse && (
        <div className="-mt-1.5 flex gap-1 rounded-[0.75rem] border-2 p-1">
          <div className="text-muted-foreground mt-auto inline-flex items-center gap-2 px-3 py-1 text-xs [writing-mode:vertical-lr]">
            {isUpcoming ? (
              <>
                <Timer className="size-4" /> Upcoming Class
              </>
            ) : (
              <>
                <Pin className="size-4 rotate-45" /> Current Class
              </>
            )}
          </div>
          <div
            className="group relative flex h-40 w-96 shrink-0 flex-col overflow-hidden rounded-xs border p-4 pl-5 transition-all hover:scale-105 hover:shadow-2xl"
            style={{
              backgroundColor: `color-mix(in oklab, ${subjectColors(
                currentCourse.classification ?? "",
              )}, var(--ui-background))`,
            }}
            tabIndex={0}
          >
            <div
              className="absolute inset-1 w-1 rounded-full"
              style={{
                backgroundColor: `color-mix(in oklab, ${subjectColors(
                  currentCourse.classification ?? "",
                )}, var(--ui-background) 30%)`,
              }}
            />
            <Link
              href={`/app/courses/${currentCourse.id}`}
              className="flex items-center gap-2"
            >
              <div
                className="rounded-xs p-2"
                style={{
                  backgroundColor: `color-mix(in oklab, ${subjectColors(
                    currentCourse.classification ?? "",
                  )}, var(--ui-background) 30%)`,
                }}
              >
                <SubjectIcon subject={currentCourse.classification ?? ""} />
              </div>
              <div className="flex max-w-full flex-col -space-y-1 overflow-hidden">
                <h3 className="truncate text-lg font-bold">
                  {currentCourse.classification}
                </h3>
                <p className="max-w-full truncate text-xs">
                  {currentCourse.name}
                </p>
              </div>
            </Link>
            <div className="flex flex-1 flex-col justify-end transition-all group-hover:translate-y-16 group-hover:scale-90 group-hover:opacity-0">
              <div className="flex items-center justify-between">
                <p className="text-xs">
                  {currentCourse.period?.periodName ?? "Unassigned"}
                </p>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
            <div className="pointer-events-none absolute top-18 right-4 bottom-4 left-5 flex flex-1 translate-y-16 scale-90 items-center gap-2 opacity-0 transition-all group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
              <Link
                href={`/app/courses/${currentCourse.id}`}
                className="grid h-full flex-1 place-items-center rounded transition-all hover:!bg-(--hover-bg)"
                style={
                  {
                    background: `color-mix(in oklab, ${subjectColors(
                      currentCourse.classification ?? "",
                    )}, var(--ui-background) 60%)`,
                    "--hover-bg": `color-mix(in oklab, ${subjectColors(
                      currentCourse.classification ?? "",
                    )}, var(--ui-background) 70%)`,
                  } as React.CSSProperties
                }
              >
                <House />
              </Link>
              <Link
                href={`/app/courses/${currentCourse.id}/modules`}
                className="grid h-full flex-1 place-items-center rounded transition-all hover:!bg-(--hover-bg)"
                style={
                  {
                    background: `color-mix(in oklab, ${subjectColors(
                      currentCourse.classification ?? "",
                    )}, var(--ui-background) 60%)`,
                    "--hover-bg": `color-mix(in oklab, ${subjectColors(
                      currentCourse.classification ?? "",
                    )}, var(--ui-background) 70%)`,
                  } as React.CSSProperties
                }
              >
                <LayoutDashboard />
              </Link>
              <Link
                href={`/app/courses/${currentCourse.id}/people`}
                className="grid h-full flex-1 place-items-center rounded transition-all hover:!bg-(--hover-bg)"
                style={
                  {
                    background: `color-mix(in oklab, ${subjectColors(
                      currentCourse.classification ?? "",
                    )}, var(--ui-background) 60%)`,
                    "--hover-bg": `color-mix(in oklab, ${subjectColors(
                      currentCourse.classification ?? "",
                    )}, var(--ui-background) 70%)`,
                  } as React.CSSProperties
                }
              >
                <UsersRound />
              </Link>
              <Link
                href={`/app/courses/${currentCourse.id}/grades`}
                className="grid h-full flex-1 place-items-center rounded transition-all hover:!bg-(--hover-bg)"
                style={
                  {
                    background: `color-mix(in oklab, ${subjectColors(
                      currentCourse.classification ?? "",
                    )}, var(--ui-background) 60%)`,
                    "--hover-bg": `color-mix(in oklab, ${subjectColors(
                      currentCourse.classification ?? "",
                    )}, var(--ui-background) 70%)`,
                  } as React.CSSProperties
                }
              >
                <Percent />
              </Link>
            </div>
          </div>
        </div>
      )}
      {courses
        .filter((_, idx) => idx < 15)
        .map((course) => (
          <div
            key={course.id}
            className="group relative flex h-40 w-96 shrink-0 flex-col overflow-hidden rounded-xs border p-4 pl-5 transition-all hover:scale-105 hover:shadow-2xl"
            style={{
              backgroundColor: `color-mix(in oklab, ${subjectColors(
                course.classification ?? "",
              )}, var(--ui-background))`,
            }}
            tabIndex={0}
          >
            <div
              className="absolute inset-1 w-1 rounded-full"
              style={{
                backgroundColor: `color-mix(in oklab, ${subjectColors(
                  course.classification ?? "",
                )}, var(--ui-background) 30%)`,
              }}
            />
            <Link
              href={`/app/courses/${course.id}`}
              className="flex items-center gap-2"
            >
              <div
                className="rounded-xs p-2"
                style={{
                  backgroundColor: `color-mix(in oklab, ${subjectColors(
                    course.classification ?? "",
                  )}, var(--ui-background) 30%)`,
                }}
              >
                <SubjectIcon subject={course.classification ?? ""} />
              </div>
              <div className="flex max-w-full flex-col -space-y-1 overflow-hidden">
                <h3 className="truncate text-lg font-bold">
                  {course.classification}
                </h3>
                <p className="max-w-full truncate text-xs">{course.name}</p>
              </div>
            </Link>
            <div className="flex flex-1 flex-col justify-end transition-all group-hover:translate-y-16 group-hover:scale-90 group-hover:opacity-0">
              <div className="flex items-center justify-between">
                <p className="text-xs">
                  {course.period?.periodName ?? "Unassigned"}
                </p>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
            <div className="pointer-events-none absolute top-18 right-4 bottom-4 left-5 flex flex-1 translate-y-16 scale-90 items-center gap-2 opacity-0 transition-all group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
              <Link
                href={`/app/courses/${course.id}`}
                className="grid h-full flex-1 place-items-center rounded transition-all hover:!bg-(--hover-bg)"
                style={
                  {
                    background: `color-mix(in oklab, ${subjectColors(
                      course.classification ?? "",
                    )}, var(--ui-background) 60%)`,
                    "--hover-bg": `color-mix(in oklab, ${subjectColors(
                      course.classification ?? "",
                    )}, var(--ui-background) 70%)`,
                  } as React.CSSProperties
                }
              >
                <House />
              </Link>
              <Link
                href={`/app/courses/${course.id}/modules`}
                className="grid h-full flex-1 place-items-center rounded transition-all hover:!bg-(--hover-bg)"
                style={
                  {
                    background: `color-mix(in oklab, ${subjectColors(
                      course.classification ?? "",
                    )}, var(--ui-background) 60%)`,
                    "--hover-bg": `color-mix(in oklab, ${subjectColors(
                      course.classification ?? "",
                    )}, var(--ui-background) 70%)`,
                  } as React.CSSProperties
                }
              >
                <LayoutDashboard />
              </Link>
              <Link
                href={`/app/courses/${course.id}/people`}
                className="grid h-full flex-1 place-items-center rounded transition-all hover:!bg-(--hover-bg)"
                style={
                  {
                    background: `color-mix(in oklab, ${subjectColors(
                      course.classification ?? "",
                    )}, var(--ui-background) 60%)`,
                    "--hover-bg": `color-mix(in oklab, ${subjectColors(
                      course.classification ?? "",
                    )}, var(--ui-background) 70%)`,
                  } as React.CSSProperties
                }
              >
                <UsersRound />
              </Link>
              <Link
                href={`/app/courses/${course.id}/grades`}
                className="grid h-full flex-1 place-items-center rounded transition-all hover:!bg-(--hover-bg)"
                style={
                  {
                    background: `color-mix(in oklab, ${subjectColors(
                      course.classification ?? "",
                    )}, var(--ui-background) 60%)`,
                    "--hover-bg": `color-mix(in oklab, ${subjectColors(
                      course.classification ?? "",
                    )}, var(--ui-background) 70%)`,
                  } as React.CSSProperties
                }
              >
                <Percent />
              </Link>
            </div>
          </div>
        ))}
    </>
  );
}

export function MiniTodoList() {
  const [isLoading, setIsLoading] = useState(true);
  const [todoItems, setTodoItems] = useState<PlannerItem[]>([]);

  useEffect(() => {
    const code = async () => {
      const req = await fetch("/api/todo/mini");
      const { data: todoItems } = (await req.json()) as {
        success: boolean;
        data: PlannerItem[];
        errors?: string[];
      };
      setTodoItems(todoItems);
      setIsLoading(false);
    };
    code().catch(console.error);
    setInterval(
      () => {
        code().catch(console.error);
      },
      60 * 5 * 1000,
    );
  }, []);

  return (
    <div className="@container mt-4 flex flex-col gap-4">
      {isLoading ? (
        <>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={`mini-todo-${idx}`} className="h-96 @3xl:h-52" />
          ))}
        </>
      ) : (
        <>
          {todoItems?.map((todoItem) => (
            <TodoItem
              key={todoItem.plannable_id}
              todoItem={todoItem}
              setTodoItems={setTodoItems}
            />
          ))}
        </>
      )}
      <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 p-16 text-xs">
        Only showing the last 14 days
        <Button
          variant="outline"
          className="group h-8 text-xs"
          href="/app/todo"
        >
          View full todo list{" "}
          <ArrowRight className="transition-all group-hover:-rotate-45" />
        </Button>
      </div>
    </div>
  );
}
