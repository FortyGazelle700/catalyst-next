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
import {
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CoursesContext, TimeContext } from "./layout.providers";
import { subjectColors, SubjectIcon } from "@/components/catalyst/subjects";
import { PlannerItem } from "@/server/api/canvas/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TodoItem } from "./todo";

export function TimeCard() {
  const time = useContext(TimeContext);
  const [greeting, setGreeting] = useState("Hi there, it is");

  useEffect(() => {
    const hours = time.getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [time]);

  return (
    <div className="relative flex-1 border stack h-52 rounded-t-md rounded-b-xs @3xl:rounded-l-md @3xl:rounded-r-xs group overflow-hidden">
      <div className="flex flex-col p-4 justify-end group-hover:scale-90 group-hover:opacity-0 transition-all">
        <h3 className="text-lg text-muted-foreground">{greeting},</h3>
        <h4 className="text-4xl font-bold flex items-center select-none">
          {time
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
              )
            )}
        </h4>
        <Button
          variant="outline"
          href="/app/schedule/clock"
          size="icon"
          className="grid absolute right-4 top-4"
        >
          <Maximize />
        </Button>
      </div>
      <Link
        href="/app/schedule/clock"
        className="grid place-items-center bg-secondary opacity-0 group-hover:opacity-100 absolute scale-150 inset-0 transition-all group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto"
      >
        <Maximize className="group-hover:-rotate-90 transition-all" />
      </Link>
    </div>
  );
}

export function MissingCard() {
  const courses = useContext(CoursesContext);
  const missingAssignments = useMemo(
    () =>
      courses.reduce((acc, course) => acc + course.data.missingAssignments, 0),
    [courses]
  );

  return (
    <div className="relative flex-1 border stack h-52 rounded-xs group overflow-hidden">
      <div className="flex flex-col p-4 justify-end group-hover:scale-90 group-hover:opacity-0 transition-all">
        <h3 className="text-lg text-muted-foreground">Missing Assignments</h3>
        <h4 className="text-4xl font-bold">{missingAssignments}</h4>
        <Button
          variant="outline"
          href="/app/todo?search.status=missing"
          size="icon"
          className="grid absolute right-4 top-4"
        >
          <ArrowUpRight />
        </Button>
      </div>
      <Link
        href="/app/todo?search.status=missing"
        className="grid place-items-center bg-secondary opacity-0 group-hover:opacity-100 absolute scale-150 inset-0 transition-all group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto"
      >
        <ArrowRight className="group-hover:-rotate-45 transition-all" />
      </Link>
    </div>
  );
}

export function CourseList() {
  const courses = useContext(CoursesContext);
  const currentCourse = useMemo(
    () => courses.find((course) => course.time?.activePinned),
    [courses]
  );

  const isUpcoming = useMemo(
    () => !currentCourse?.time.active,
    [currentCourse]
  );

  return (
    <>
      {currentCourse && (
        <div className="border-2 p-1 rounded-[0.75rem] flex gap-1 -mt-1.5">
          <div className="[writing-mode:vertical-lr] text-xs text-muted-foreground mt-auto px-3 inline-flex items-center gap-2 py-1">
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
            className="relative w-96 h-40 rounded-xs border flex flex-col flex-shrink-0 overflow-hidden p-4 pl-5 group"
            style={{
              backgroundColor: `color-mix(in oklab, ${subjectColors(
                currentCourse.classification ?? ""
              )}, var(--ui-background))`,
            }}
            tabIndex={0}
          >
            <div
              className="absolute inset-1 w-1 rounded-full"
              style={{
                backgroundColor: `color-mix(in oklab, ${subjectColors(
                  currentCourse.classification ?? ""
                )}, var(--ui-background) 30%)`,
              }}
            />
            <Link
              href={`/app/courses/${currentCourse.id}`}
              className="flex gap-2 items-center"
            >
              <div
                className="rounded-xs p-2"
                style={{
                  backgroundColor: `color-mix(in oklab, ${subjectColors(
                    currentCourse.classification ?? ""
                  )}, var(--ui-background) 30%)`,
                }}
              >
                <SubjectIcon subject={currentCourse.classification ?? ""} />
              </div>
              <div className="flex flex-col -space-y-1 max-w-full overflow-hidden">
                <h3 className="text-lg font-bold truncate">
                  {currentCourse.classification}
                </h3>
                <p className="text-xs truncate max-w-full">
                  {currentCourse.name}
                </p>
              </div>
            </Link>
            <div className="flex-1 flex flex-col justify-end group-hover:opacity-0 group-hover:translate-y-16 group-hover:scale-90 transition-all">
              <div className="flex items-center justify-between">
                <p className="text-xs">
                  {currentCourse.period?.periodName ?? "Unassigned"}
                </p>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto absolute flex-1 top-18 bottom-4 left-5 right-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-16 group-hover:translate-y-0 group-focus-within:translate-y-0 group-hover:scale-100 group-focus-within:scale-100 scale-90 transition-all flex gap-2 items-center">
              <Link
                href={`/app/courses/${currentCourse.id}`}
                className="flex-1 grid place-items-center h-full rounded"
                style={{
                  background: `color-mix(in oklab, ${subjectColors(
                    currentCourse.classification ?? ""
                  )}, var(--ui-background) 60%)`,
                }}
              >
                <House />
              </Link>
              <Link
                href={`/app/courses/${currentCourse.id}/modules`}
                className="flex-1 grid place-items-center h-full rounded"
                style={{
                  background: `color-mix(in oklab, ${subjectColors(
                    currentCourse.classification ?? ""
                  )}, var(--ui-background) 60%)`,
                }}
              >
                <LayoutDashboard />
              </Link>
              <Link
                href={`/app/courses/${currentCourse.id}/people`}
                className="flex-1 grid place-items-center h-full rounded"
                style={{
                  background: `color-mix(in oklab, ${subjectColors(
                    currentCourse.classification ?? ""
                  )}, var(--ui-background) 60%)`,
                }}
              >
                <UsersRound />
              </Link>
              <Link
                href={`/app/courses/${currentCourse.id}/grades`}
                className="flex-1 grid place-items-center h-full rounded"
                style={{
                  background: `color-mix(in oklab, ${subjectColors(
                    currentCourse.classification ?? ""
                  )}, var(--ui-background) 60%)`,
                }}
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
            className="relative w-96 h-40 rounded-xs border flex flex-col flex-shrink-0 overflow-hidden p-4 pl-5 group"
            style={{
              backgroundColor: `color-mix(in oklab, ${subjectColors(
                course.classification ?? ""
              )}, var(--ui-background))`,
            }}
            tabIndex={0}
          >
            <div
              className="absolute inset-1 w-1 rounded-full"
              style={{
                backgroundColor: `color-mix(in oklab, ${subjectColors(
                  course.classification ?? ""
                )}, var(--ui-background) 30%)`,
              }}
            />
            <Link
              href={`/app/courses/${course.id}`}
              className="flex gap-2 items-center"
            >
              <div
                className="rounded-xs p-2"
                style={{
                  backgroundColor: `color-mix(in oklab, ${subjectColors(
                    course.classification ?? ""
                  )}, var(--ui-background) 30%)`,
                }}
              >
                <SubjectIcon subject={course.classification ?? ""} />
              </div>
              <div className="flex flex-col -space-y-1 max-w-full overflow-hidden">
                <h3 className="text-lg font-bold truncate">
                  {course.classification}
                </h3>
                <p className="text-xs truncate max-w-full">{course.name}</p>
              </div>
            </Link>
            <div className="flex-1 flex flex-col justify-end group-hover:opacity-0 group-hover:translate-y-16 group-hover:scale-90 transition-all">
              <div className="flex items-center justify-between">
                <p className="text-xs">
                  {course.period?.periodName ?? "Unassigned"}
                </p>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto absolute flex-1 top-18 bottom-4 left-5 right-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-16 group-hover:translate-y-0 group-focus-within:translate-y-0 group-hover:scale-100 group-focus-within:scale-100 scale-90 transition-all flex gap-2 items-center">
              <Link
                href={`/app/courses/${course.id}`}
                className="flex-1 grid place-items-center h-full rounded"
                style={{
                  background: `color-mix(in oklab, ${subjectColors(
                    course.classification ?? ""
                  )}, var(--ui-background) 60%)`,
                }}
              >
                <House />
              </Link>
              <Link
                href={`/app/courses/${course.id}/modules`}
                className="flex-1 grid place-items-center h-full rounded"
                style={{
                  background: `color-mix(in oklab, ${subjectColors(
                    course.classification ?? ""
                  )}, var(--ui-background) 60%)`,
                }}
              >
                <LayoutDashboard />
              </Link>
              <Link
                href={`/app/courses/${course.id}/people`}
                className="flex-1 grid place-items-center h-full rounded"
                style={{
                  background: `color-mix(in oklab, ${subjectColors(
                    course.classification ?? ""
                  )}, var(--ui-background) 60%)`,
                }}
              >
                <UsersRound />
              </Link>
              <Link
                href={`/app/courses/${course.id}/grades`}
                className="flex-1 grid place-items-center h-full rounded"
                style={{
                  background: `color-mix(in oklab, ${subjectColors(
                    course.classification ?? ""
                  )}, var(--ui-background) 60%)`,
                }}
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
      const { data: todoItems } = await req.json();
      setTodoItems(todoItems);
      setIsLoading(false);
    };
    code().catch(console.error);
    setInterval(code, 60 * 5 * 1000);
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-4 @container">
      {isLoading ? (
        <>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={`mini-todo-${idx}`} className="h-96 @3xl:h-52" />
          ))}
        </>
      ) : (
        <>
          {todoItems.map((todoItem) => (
            <TodoItem
              key={todoItem.plannable_id}
              todoItem={todoItem}
              setTodoItems={setTodoItems}
            />
          ))}
        </>
      )}
      <div className="flex flex-col gap-2 items-center justify-center p-16 text-xs text-muted-foreground">
        Only showing the last 14 days
        <Button
          variant="outline"
          className="text-xs h-8 group"
          href="/app/todo"
        >
          View full todo list{" "}
          <ArrowRight className="group-hover:-rotate-45 transition-all" />
        </Button>
      </div>
    </div>
  );
}
