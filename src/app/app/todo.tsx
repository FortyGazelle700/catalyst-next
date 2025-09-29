"use client";

import { useContext, useMemo, useState } from "react";
import { CoursesContext, TimeContext, useTodoItems } from "./layout.providers";
import type { Course, PlannerItem } from "@/server/api/canvas/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Temporal } from "@js-temporal/polyfill";
import { formatDuration } from "@/components/catalyst/format-duration";
import { LinkModal } from "@/components/catalyst/link-modal";
import {
  PrettyState,
  SubmissionTypeWithIcon,
} from "@/components/catalyst/pretty-state";
import { subjectColors, SubjectIcon } from "@/components/catalyst/subjects";
import {
  ArrowRight,
  Calendar,
  Notebook,
  StickyNote,
  Dot,
  Timer,
  Eye,
  Pencil,
  Upload,
  Minus,
  Slash,
} from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import CreateTodoItemModalPage from "./todo/[id]/edit/page.modal";
import TodoItemModalPage from "./todo/[id]/page.modal";
import { AssignmentDialogPage } from "./courses/[course]/assignments/[assignment]/page.modal";
import SubmissionDialogPage from "./courses/[course]/assignments/[assignment]/submission.modal";
import { cn } from "@/lib/utils";

export function TodoItem({ todoItem }: { todoItem: PlannerItem }) {
  const courses = useContext(CoursesContext);
  const now = useContext(TimeContext);
  const { setTodoItems } = useTodoItems();
  const [requests, setRequests] = useState(0);

  const course = courses.find(
    (course) =>
      course.id == (todoItem.course_id ?? todoItem.plannable.course_id),
  );

  const dueDate = useMemo(
    () => new Date(todoItem.plannable_date ?? todoItem.plannable.due_at ?? ""),
    [todoItem],
  );

  const pastDue = useMemo(
    () => now.getTime() > dueDate.getTime(),
    [dueDate, now],
  );

  return (
    <div
      key={todoItem.plannable_id}
      className="flex h-72 flex-col gap-2 rounded-md border p-2 transition-all hover:!scale-100 hover:!opacity-90 has-[&[data-state='checked']]:scale-[97%] has-[&[data-state='checked']]:opacity-50 @3xl:h-36 @3xl:flex-row"
    >
      <div className="flex flex-1 flex-col gap-2">
        <label className="group flex cursor-pointer items-center gap-2">
          <Checkbox
            className="size-8 cursor-pointer rounded-full"
            checked={
              !!(
                todoItem.planner_override?.marked_complete ??
                (todoItem.plannable?.content_details?.submission
                  ?.workflow_state == "submitted" ||
                  todoItem.plannable?.content_details?.submission
                    ?.workflow_state == "graded" ||
                  false)
              )
            }
            onCheckedChange={async (checked) => {
              const markAsChecked = () => {
                setTodoItems((prev) =>
                  prev.map((item) =>
                    item.plannable_id == todoItem.plannable_id
                      ? ({
                          ...item,
                          planner_override: {
                            ...item.planner_override,
                            marked_complete: checked,
                          },
                        } as PlannerItem)
                      : item,
                  ),
                );
              };
              setRequests(requests + 1);
              markAsChecked();
              setTimeout(() => {
                (async () => {
                  setRequests(requests - 1);
                  if (requests == 0) {
                    await fetch("/api/todo/mark-complete", {
                      method: "PUT",
                      body: JSON.stringify({
                        id: Number(todoItem.plannable_id),
                        complete: checked,
                      }),
                    }).catch(console.error);
                    markAsChecked();
                  }
                })().catch(console.error);
              }, 2000);
            }}
          />
          <h3 className="h3 relative !mt-0 max-w-[calc(100%-4rem)] overflow-hidden">
            <div className="bg-primary absolute top-1/2 h-0.5 w-0 -translate-y-1/2 rounded-full transition-all group-hover:w-2 group-has-[&[data-state='checked']]:w-full group-has-[&[data-state='checked']]:group-hover:w-[calc(100%-calc(var(--spacing)*2))]" />
            <div className="max-w-full truncate overflow-hidden transition-all group-hover:scale-95 group-hover:opacity-90 group-has-[&[data-state='checked']]:scale-90 group-has-[&[data-state='checked']]:opacity-50 group-has-[&[data-state='checked']]:group-hover:scale-95 group-has-[&[data-state='checked']]:group-hover:opacity-60">
              {todoItem.plannable.title}
            </div>
          </h3>
        </label>
        <div className="flex flex-col gap-2 @3xl:flex-row">
          <Button
            variant="outline"
            href={`/app/courses/${todoItem.course_id}`}
            className="group flex gap-2 rounded-md p-2 text-xs"
          >
            <SubjectIcon
              subject={course?.classification ?? ""}
              className="size-4"
            />
            <span className="max-w-[30ch] truncate overflow-hidden">
              {course?.classification} ({course?.original_name})
            </span>
            <ArrowRight className="size-4 transition-all group-hover:-rotate-45" />
          </Button>
          {todoItem.html_url && (
            <Button
              variant="outline"
              href={`/app${todoItem.html_url?.split("/submissions")[0]}`}
              className="group flex gap-2 rounded-md p-2 text-xs"
            >
              <Notebook className="size-4" />
              <span className="max-w-[30ch] truncate overflow-hidden">
                {todoItem.plannable.title}
              </span>
              <ArrowRight className="size-4 transition-all group-hover:-rotate-45" />
            </Button>
          )}
          {todoItem.plannable_type == "planner_note" && (
            <Button
              variant="outline"
              href={`/app/todo/${todoItem.plannable_id}`}
              className="group flex gap-2 rounded-md p-2 text-xs"
            >
              <StickyNote className="size-4" />
              <span className="max-w-[30ch] truncate overflow-hidden">
                {todoItem.plannable.title}
              </span>
              <ArrowRight className="size-4 transition-all group-hover:-rotate-45" />
            </Button>
          )}
        </div>
        <div className="mt-2 flex flex-col gap-2 px-4 @3xl:flex-row">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="size-4" />
            <span>
              Due on{" "}
              {Temporal.Instant.from(
                new Date(
                  todoItem.plannable_date ?? todoItem.plannable.due_at ?? "",
                ).toISOString(),
              ).toLocaleString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}{" "}
              at{" "}
              {Temporal.Instant.from(
                new Date(
                  todoItem.plannable_date ?? todoItem.plannable.due_at ?? "",
                ).toISOString(),
              ).toLocaleString(undefined, {
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
          </div>
          <Dot className="stroke-muted-foreground hidden size-4 @3xl:block" />
          <div className="flex items-center gap-2 text-xs">
            <Timer className="size-3" />
            <span className="text-xs">
              Due {pastDue ? "" : "in "}
              {formatDuration(
                Temporal.Instant.from(Temporal.Instant.from(now.toISOString()))
                  .until(
                    new Date(
                      todoItem.plannable_date ??
                        todoItem.plannable.due_at ??
                        "",
                    ).toISOString(),
                  )
                  .abs(),
                {
                  minUnit: "second",
                  maxUnit: "day",
                  maxUnits: 2,
                  style: "medium",
                },
              )}{" "}
              {pastDue ? " ago" : ""}
            </span>
          </div>
          <Dot className="stroke-muted-foreground hidden size-4 @3xl:block" />
          <div className="flex items-center gap-2 text-xs">
            <PrettyState
              className="size-4"
              state={
                todoItem.plannable?.content_details?.submission
                  ?.workflow_state ?? ""
              }
            />
          </div>
          <Dot className="stroke-muted-foreground hidden size-4 @3xl:block" />
          <div className="flex items-center gap-2 text-xs">
            <SubmissionTypeWithIcon
              submission={
                todoItem.plannable?.content_details?.submission_types?.at(0) ??
                "none"
              }
              className="size-4"
            />
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-row items-end justify-end @3xl:flex-col">
        <div className="flex flex-1 items-start justify-start gap-2 @3xl:justify-end">
          {todoItem.plannable_type == "planner_note" ? (
            <>
              <LinkModal
                link={`/app/todo/${todoItem.plannable_id}/edit`}
                trigger={
                  <Button
                    className="w-9 @lg:w-auto @3xl:w-9 @5xl:w-auto"
                    variant="outline"
                  >
                    <Pencil />
                    <span className="hidden @lg:flex @3xl:hidden @5xl:flex">
                      Edit
                    </span>
                  </Button>
                }
                title="Edit Todo Item"
                description="Edit this planner note"
                breadcrumbs={
                  <Breadcrumbs
                    pathname={`/app/todo/${todoItem.plannable_id}/edit`}
                    params={{
                      id: todoItem.plannable_id.toString(),
                    }}
                  />
                }
                content={
                  <CreateTodoItemModalPage
                    id={todoItem.plannable_id.toString()}
                  />
                }
              />
              <LinkModal
                link={`/app/todo/${todoItem.plannable_id}`}
                trigger={
                  <Button
                    className="w-9 @lg:w-auto @3xl:w-9 @5xl:w-auto"
                    variant="secondary"
                  >
                    <Eye />
                    <span className="hidden @lg:flex @3xl:hidden @5xl:flex">
                      View
                    </span>
                  </Button>
                }
                title="Planner Note"
                description="View this planner note"
                breadcrumbs={
                  <Breadcrumbs
                    pathname={`/app/todo/${todoItem.plannable_id}`}
                    params={{
                      id: todoItem.plannable_id.toString(),
                    }}
                  />
                }
                content={
                  <TodoItemModalPage id={Number(todoItem.plannable_id)} />
                }
              />
            </>
          ) : (
            <>
              <LinkModal
                link={`/app${todoItem.html_url?.split("/submissions")[0]}`}
                trigger={
                  <Button
                    className="w-9 @lg:w-auto @3xl:w-9 @5xl:w-auto"
                    variant="outline"
                  >
                    <Upload />
                    <span className="hidden @lg:flex @3xl:hidden @5xl:flex">
                      Start Submission
                    </span>
                  </Button>
                }
                title="Assignment"
                description="View this assignment"
                breadcrumbs={
                  <Breadcrumbs
                    pathname={`/app${
                      todoItem.html_url?.split("/submissions")[0]
                    }`}
                    params={{
                      course:
                        todoItem.plannable?.content_details?.course_id?.toString() ??
                        "",
                      assignment:
                        todoItem.plannable?.content_details?.id?.toString() ??
                        "",
                    }}
                  />
                }
                content={
                  <SubmissionDialogPage
                    course={todoItem.plannable?.content_details?.course_id}
                    assignment={todoItem.plannable?.content_details?.id}
                  />
                }
              />
              <LinkModal
                link={`/app${todoItem.html_url?.split("/submissions")[0]}`}
                trigger={
                  <Button
                    className="w-9 @lg:w-auto @3xl:w-9 @5xl:w-auto"
                    variant="secondary"
                  >
                    <Eye />
                    <span className="hidden @lg:flex @3xl:hidden @5xl:flex">
                      View Assignment
                    </span>
                  </Button>
                }
                title="Assignment"
                description="View this assignment"
                breadcrumbs={
                  <Breadcrumbs
                    pathname={`/app${
                      todoItem.html_url?.split("/submissions")[0]
                    }`}
                    params={{
                      course:
                        todoItem.plannable?.content_details?.course_id?.toString() ??
                        "",
                      assignment:
                        todoItem.plannable?.content_details?.id?.toString() ??
                        "",
                    }}
                  />
                }
                content={
                  <AssignmentDialogPage
                    course={todoItem.plannable?.content_details?.course_id}
                    assignment={todoItem.plannable?.content_details?.id}
                  />
                }
              />
            </>
          )}
        </div>
        <div className="flex flex-row items-center justify-end @3xl:flex-col @3xl:items-end">
          <div className="text-muted-foreground inline-flex items-center gap-2 pr-4 text-xl font-bold">
            {todoItem.plannable.content_details?.points_possible ? (
              <>
                {todoItem.plannable.content_details.submission?.score !=
                undefined ? (
                  Number(
                    Number(
                      todoItem.plannable.content_details.submission?.score,
                    )?.toFixed(2),
                  )
                ) : (
                  <Minus />
                )}
                <Slash className="size-4" />
              </>
            ) : (
              ""
            )}
          </div>
          <div className="inline-flex items-center gap-1 text-4xl font-bold">
            {todoItem.plannable.content_details?.points_possible ? (
              `${todoItem.plannable.content_details?.points_possible} pts`
            ) : (
              <>
                <Minus className="size-8" /> pts
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TimeTodoCard({
  date,
  hour,
  isToday,
  now,
  items: todoItems,
  dayWidth,
}: {
  date: Date;
  hour: number;
  isToday: boolean;
  now: Date;
  items: PlannerItem[];
  dayWidth: string;
}) {
  const courses = useContext(CoursesContext);
  const { setTodoItems } = useTodoItems();

  const startOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const days: { label: string; date: Date; isToday: boolean }[] =
    useMemo(() => {
      const result: { label: string; date: Date; isToday: boolean }[] = [];
      const today = startOfDay(now);
      for (let i = -1; i < 15; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        let label = "";
        if (i === -1) label = "Yesterday";
        else if (i === 0) label = "Today";
        else label = date.toLocaleDateString(undefined, { weekday: "short" });
        result.push({ label, date, isToday: i === 0 });
      }
      return result;
    }, [now]);

  const hours = useMemo(() => {
    const hourArray = [];
    for (let hour = 6; hour <= 23; hour++) {
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      hourArray.push({
        hour,
        label: date
          .toLocaleTimeString(undefined, {
            hour: "numeric",
            hour12: true,
          })
          .replace(":00", ""),
      });
    }
    return hourArray;
  }, []);

  // Group todoItems by day and time
  const itemsByDayAndTime = useMemo(() => {
    const map: Record<string, Record<number, PlannerItem[]>> = {};

    // Initialize map structure
    days.forEach(({ date }) => {
      const dayKey = startOfDay(date).toISOString();
      map[dayKey] = {};
      hours.forEach(({ hour }) => {
        if (map[dayKey]) {
          map[dayKey][hour] = [];
        }
      });
    });

    todoItems.forEach((item) => {
      const dueDate = item.plannable?.due_at ?? item.plannable_date;
      if (!dueDate) return;

      const parsedDate = new Date(dueDate);
      const dayKey = startOfDay(parsedDate).toISOString();
      const hour = parsedDate.getHours();

      // If the item has a specific time, place it in that hour
      // Otherwise, place it in the 8 AM slot as default
      const targetHour = hour >= 6 && hour <= 23 ? hour : 6;

      if (map[dayKey]?.[targetHour]) {
        map[dayKey][targetHour].push(item);
      }
    });

    return map;
  }, [todoItems, days, hours]);

  const dayKey = startOfDay(date).toISOString();
  const itemsForThisHour = itemsByDayAndTime[dayKey]?.[hour] ?? [];
  const currentHour = now.getHours();
  const isCurrentHour = isToday && hour == currentHour;
  const isRelativeHour = hour == currentHour;

  const [requests, setRequests] = useState(0);

  // Track if submission modal is open
  const [submissionModalOpenId, setSubmissionModalOpenId] = useState<
    number | null
  >(null);

  return (
    <div
      key={`${dayKey}-${hour}`}
      className={cn(
        "hover:!bg-primary/5 relative flex min-h-[0.5rem] flex-col gap-1 border-r p-1 transition-all last:border-r-0",
        (date.getDay() == 0 || date.getDay() == 6) &&
          !isToday &&
          "bg-muted/10 hover:!bg-primary/10",
        isToday && "bg-primary/10 hover:!bg-primary/15",
      )}
      style={{ width: dayWidth }}
    >
      {itemsForThisHour.length > 0 && (
        <div className="space-y-1">
          {itemsForThisHour.map((todoItem) => {
            const course = courses.find(
              (course) =>
                course.id ==
                (todoItem.course_id ?? todoItem.plannable.course_id),
            );
            const pastDue = todoItem.plannable?.due_at
              ? new Date(todoItem.plannable.due_at) < now
              : todoItem.plannable_date
                ? new Date(todoItem.plannable_date) < now
                : false;

            const markedCompleted = !!(
              todoItem.planner_override?.marked_complete ??
              (todoItem.plannable?.content_details?.submission
                ?.workflow_state == "submitted" ||
                todoItem.plannable?.content_details?.submission
                  ?.workflow_state == "graded" ||
                false)
            );

            // Create unique IDs for the modal triggers
            const noteTriggerId = `note-trigger-${todoItem.plannable_id}`;
            const submissionTriggerId = `submission-trigger-${todoItem.plannable_id}`;
            const assignmentTriggerId = `assignment-trigger-${todoItem.plannable_id}`;

            const modalTriggers = (
              <>
                {todoItem.plannable_type == "planner_note" ? (
                  <LinkModal
                    link={`/app/todo/${todoItem.plannable_id}`}
                    trigger={
                      <button
                        id={noteTriggerId}
                        style={{ display: "none" }}
                        aria-hidden="true"
                      />
                    }
                    title="Planner Note"
                    description="View this planner note"
                    breadcrumbs={
                      <Breadcrumbs
                        pathname={`/app/todo/${todoItem.plannable_id}`}
                        params={{
                          id: todoItem.plannable_id.toString(),
                        }}
                      />
                    }
                    content={
                      <TodoItemModalPage id={Number(todoItem.plannable_id)} />
                    }
                  />
                ) : (
                  <>
                    <LinkModal
                      link={`/app${todoItem.html_url?.split("/submissions")[0]}`}
                      trigger={
                        <button
                          id={submissionTriggerId}
                          style={{ display: "none" }}
                          aria-hidden="true"
                        />
                      }
                      title="Assignment"
                      description="Start working on this assignment"
                      breadcrumbs={
                        <Breadcrumbs
                          pathname={`/app${todoItem.html_url?.split("/submissions")[0]}`}
                          params={{
                            course:
                              todoItem.plannable?.content_details?.course_id?.toString() ??
                              "",
                            assignment:
                              todoItem.plannable?.content_details?.id?.toString() ??
                              "",
                          }}
                        />
                      }
                      onOpenChange={(open) => {
                        setSubmissionModalOpenId(
                          open ? Number(todoItem.plannable_id) : null,
                        );
                      }}
                      content={
                        <SubmissionDialogPage
                          course={
                            todoItem.plannable?.content_details?.course_id
                          }
                          assignment={todoItem.plannable?.content_details?.id}
                        />
                      }
                    />
                    <LinkModal
                      link={`/app${todoItem.html_url?.split("/submissions")[0]}`}
                      trigger={
                        <button
                          id={assignmentTriggerId}
                          style={{ display: "none" }}
                          aria-hidden="true"
                        />
                      }
                      title="Assignment"
                      description="View this assignment"
                      breadcrumbs={
                        <Breadcrumbs
                          pathname={`/app${todoItem.html_url?.split("/submissions")[0]}`}
                          params={{
                            course:
                              todoItem.plannable?.content_details?.course_id?.toString() ??
                              "",
                            assignment:
                              todoItem.plannable?.content_details?.id?.toString() ??
                              "",
                          }}
                        />
                      }
                      content={
                        <AssignmentDialogPage
                          course={
                            todoItem.plannable?.content_details?.course_id
                          }
                          assignment={todoItem.plannable?.content_details?.id}
                        />
                      }
                    />
                  </>
                )}
              </>
            );

            // Click handler to open the correct modal
            const handleClick = (e: React.MouseEvent) => {
              // Don't open modal if clicking on interactive elements or if submission modal is open
              const target = e.target as HTMLElement;
              if (
                target.closest("button") ||
                target.closest('[role="dialog"]') ||
                target.closest(".checkbox") ||
                (todoItem.plannable_type !== "planner_note" &&
                  submissionModalOpenId === Number(todoItem.plannable_id))
              ) {
                return;
              }

              e.preventDefault();

              if (todoItem.plannable_type == "planner_note") {
                document.getElementById(noteTriggerId)?.click();
              } else {
                document.getElementById(assignmentTriggerId)?.click();
              }
            };

            return (
              <div key={todoItem.plannable_id}>
                {modalTriggers}
                <a
                  href={
                    todoItem.plannable_type == "planner_note"
                      ? `/app/todo/${todoItem.plannable_id}`
                      : `/app${todoItem.html_url?.split("/submissions")[0]}`
                  }
                  onClick={handleClick}
                  className={cn(
                    "block transition-all",
                    markedCompleted && "opacity-50 hover:opacity-100",
                  )}
                >
                  <div
                    className="relative flex cursor-pointer flex-col gap-2 rounded-xs p-2 pl-4 text-xs transition-colors hover:shadow-md"
                    style={{
                      backgroundColor: `color-mix(in oklab, ${course ? subjectColors(course.classification ?? "") : "var(--ui-muted-foreground)"}, transparent 90%)`,
                    }}
                  >
                    <div
                      className="absolute top-1 bottom-1 left-1 w-1 rounded-full"
                      style={{
                        backgroundColor: course
                          ? subjectColors(course.classification ?? "")
                          : "var(--ui-muted-foreground)",
                      }}
                    ></div>
                    <div className="mb-1 flex items-center gap-2">
                      <Checkbox
                        className="size-6 cursor-pointer rounded-full [&:not([data-state=checked])_svg]:opacity-30"
                        checked={markedCompleted}
                        onClick={async (evt) => {
                          evt.preventDefault();
                          evt.stopPropagation();

                          const checked = !markedCompleted;
                          const markAsChecked = () => {
                            setTodoItems((prev) =>
                              prev.map((item) =>
                                item.plannable_id == todoItem.plannable_id
                                  ? ({
                                      ...item,
                                      planner_override: {
                                        ...item.planner_override,
                                        marked_complete:
                                          !item.planner_override
                                            ?.marked_complete,
                                      },
                                    } as PlannerItem)
                                  : item,
                              ),
                            );
                          };
                          setRequests(requests + 1);
                          setTimeout(() => {
                            markAsChecked();
                          }, 100);
                          setTimeout(() => {
                            (async () => {
                              setRequests(requests - 1);
                              if (requests == 0) {
                                await fetch("/api/todo/mark-complete", {
                                  method: "PUT",
                                  body: JSON.stringify({
                                    id: Number(todoItem.plannable_id),
                                    complete: checked,
                                  }),
                                }).catch(console.error);
                                markAsChecked();
                              }
                            })().catch(console.error);
                          }, 2000);
                        }}
                      />
                      <span className="relative flex-1 truncate font-bold">
                        {/* Strikethrough effect like in TodoItem */}
                        <div
                          className={cn(
                            "bg-primary absolute top-1/2 left-0 h-0.5 w-0 -translate-y-1/2 rounded-full transition-all",
                            markedCompleted && "w-full",
                          )}
                        />
                        <div
                          className={cn(
                            "max-w-full truncate overflow-hidden transition-all",
                            markedCompleted && "scale-90 opacity-50",
                          )}
                        >
                          {todoItem.plannable?.title || "Untitled"}
                        </div>
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      {course ? (
                        <>
                          <SubjectIcon
                            subject={course.classification ?? ""}
                            className="size-4 shrink-0"
                          />{" "}
                          <span className="flex-1 truncate">
                            {course.classification} ({course.original_name})
                          </span>
                        </>
                      ) : (
                        <span className="italic">
                          <div className="size-4 shrink-0" />
                          No course
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <span className="text-xs">
                        Due {pastDue ? "" : "in "}
                        {formatDuration(
                          Temporal.Instant.from(now.toISOString())
                            .until(
                              Temporal.Instant.from(
                                new Date(
                                  todoItem.plannable_date ??
                                    todoItem.plannable.due_at ??
                                    "",
                                ).toISOString(),
                              ),
                            )
                            .abs(),
                          {
                            minUnit: "second",
                            maxUnit: "day",
                            maxUnits: 1,
                            style: "medium",
                          },
                        )}{" "}
                        {pastDue ? " ago" : ""}
                      </span>
                      {" — at "}
                      {new Date(
                        todoItem.plannable?.due_at ?? todoItem.plannable_date!,
                      ).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <PrettyState
                        className="size-3"
                        state={
                          todoItem.plannable?.content_details?.submission
                            ?.workflow_state ?? ""
                        }
                      />
                      <div className="flex-1" />
                      <span>
                        {todoItem.plannable?.content_details?.points_possible
                          ? todoItem.plannable?.content_details?.submission
                              ?.score != undefined
                            ? Number(
                                Number(
                                  todoItem.plannable?.content_details
                                    ?.submission?.score,
                                )?.toFixed(2),
                              )
                            : "—"
                          : "—"}{" "}
                        /{" "}
                        {todoItem.plannable?.content_details?.points_possible ??
                          "—"}{" "}
                        pts
                      </span>
                      {todoItem.plannable_type == "planner_note" ? (
                        <LinkModal
                          link={`/app/todo/${todoItem.plannable_id}`}
                          stopPropagation
                          trigger={
                            <Button
                              variant="link"
                              className="text-muted-foreground h-4 text-xs"
                            >
                              <Eye className="size-3" />
                              View Note
                            </Button>
                          }
                          title="Planner Note"
                          description="View this planner note"
                          breadcrumbs={
                            <Breadcrumbs
                              pathname={`/app/todo/${todoItem.plannable_id}`}
                              params={{
                                id: todoItem.plannable_id.toString(),
                              }}
                            />
                          }
                          content={
                            <TodoItemModalPage
                              id={Number(todoItem.plannable_id)}
                            />
                          }
                        />
                      ) : (
                        <LinkModal
                          link={`/app${todoItem.html_url?.split("/submissions")[0]}`}
                          stopPropagation
                          trigger={
                            <Button
                              variant="link"
                              className="text-muted-foreground h-4 text-xs"
                            >
                              <Upload className="size-3" />
                              Upload
                            </Button>
                          }
                          title="Assignment"
                          description="Start working on this assignment"
                          onOpenChange={(open) => {
                            if (!open) {
                              // Add a small delay before clearing the state to prevent
                              // the assignment modal from opening when backdrop is clicked
                              setTimeout(() => {
                                setSubmissionModalOpenId(null);
                              }, 100);
                            } else {
                              setSubmissionModalOpenId(
                                Number(todoItem.plannable_id),
                              );
                            }
                          }}
                          breadcrumbs={
                            <Breadcrumbs
                              pathname={`/app${todoItem.html_url?.split("/submissions")[0]}`}
                              params={{
                                course:
                                  todoItem.plannable?.content_details?.course_id?.toString() ??
                                  "",
                                assignment:
                                  todoItem.plannable?.content_details?.id?.toString() ??
                                  "",
                              }}
                            />
                          }
                          content={
                            <SubmissionDialogPage
                              course={
                                todoItem.plannable?.content_details?.course_id
                              }
                              assignment={
                                todoItem.plannable?.content_details?.id
                              }
                            />
                          }
                        />
                      )}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      )}
      {isRelativeHour && (
        <div
          className={cn(
            "bg-primary pointer-events-none absolute right-0 left-0 z-10 h-0.5",
            !isCurrentHour && "opacity-20",
          )}
          style={{
            top: `${(now.getMinutes() / 60) * 100}%`,
          }}
        >
          {isCurrentHour && (
            <div className="bg-primary text-primary-foreground absolute top-1/2 left-0 flex h-4 w-[10ch] -translate-1/2 items-center justify-center rounded-full text-xs font-bold shadow-md">
              {now.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CalendarTodoCard({ item }: { date: Date; item: PlannerItem }) {
  const courses = useContext(CoursesContext);
  const { setTodoItems } = useTodoItems();
  const [requests, setRequests] = useState(0);

  const course = courses.find(
    (course) => course.id == (item.course_id ?? item.plannable.course_id),
  );

  const markedCompleted = !!(
    item.planner_override?.marked_complete ??
    (item.plannable?.content_details?.submission?.workflow_state ==
      "submitted" ||
      item.plannable?.content_details?.submission?.workflow_state == "graded" ||
      false)
  );

  // Track if submission modal is open
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  // Create unique IDs for the modal triggers
  const noteTriggerId = `note-trigger-${item.plannable_id}`;
  const submissionTriggerId = `submission-trigger-${item.plannable_id}`;
  const assignmentTriggerId = `assignment-trigger-${item.plannable_id}`;

  // Click handler to open the correct modal
  const handleClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on interactive elements or if submission modal is open
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest('[role="dialog"]') ||
      target.closest(".checkbox") ||
      (item.plannable_type !== "planner_note" && submissionModalOpen)
    ) {
      return;
    }

    e.preventDefault();

    if (item.plannable_type == "planner_note") {
      document.getElementById(noteTriggerId)?.click();
    } else {
      document.getElementById(assignmentTriggerId)?.click();
    }
  };

  return (
    <div
      key={item.plannable_id}
      className={cn("relative flex w-full flex-col gap-1 p-2 transition-all")}
    >
      {/* Always render the modal content outside of HoverCard */}
      {item.plannable_type == "planner_note" ? (
        <LinkModal
          link={`/app/todo/${item.plannable_id}`}
          trigger={
            <button
              id={noteTriggerId}
              style={{ display: "none" }}
              aria-hidden="true"
            />
          }
          title="Planner Note"
          description="View this planner note"
          breadcrumbs={
            <Breadcrumbs
              pathname={`/app/todo/${item.plannable_id}`}
              params={{
                id: item.plannable_id.toString(),
              }}
            />
          }
          content={<TodoItemModalPage id={Number(item.plannable_id)} />}
        />
      ) : (
        <>
          <LinkModal
            link={`/app${item.html_url?.split("/submissions")[0]}`}
            trigger={
              <button
                id={submissionTriggerId}
                style={{ display: "none" }}
                aria-hidden="true"
              />
            }
            title="Assignment"
            description="Start working on this assignment"
            onOpenChange={(open) => {
              if (!open) {
                // Add a small delay before clearing the state to prevent
                // the assignment modal from opening when backdrop is clicked
                setTimeout(() => {
                  setSubmissionModalOpen(false);
                }, 100);
              } else {
                setSubmissionModalOpen(true);
              }
            }}
            breadcrumbs={
              <Breadcrumbs
                pathname={`/app${item.html_url?.split("/submissions")[0]}`}
                params={{
                  course:
                    item.plannable?.content_details?.course_id?.toString() ??
                    "",
                  assignment:
                    item.plannable?.content_details?.id?.toString() ?? "",
                }}
              />
            }
            content={
              <SubmissionDialogPage
                course={item.plannable?.content_details?.course_id}
                assignment={item.plannable?.content_details?.id}
              />
            }
          />
          <LinkModal
            link={`/app${item.html_url?.split("/submissions")[0]}`}
            trigger={
              <button
                id={assignmentTriggerId}
                style={{ display: "none" }}
                aria-hidden="true"
              />
            }
            title="Assignment"
            description="View this assignment"
            breadcrumbs={
              <Breadcrumbs
                pathname={`/app${item.html_url?.split("/submissions")[0]}`}
                params={{
                  course:
                    item.plannable?.content_details?.course_id?.toString() ??
                    "",
                  assignment:
                    item.plannable?.content_details?.id?.toString() ?? "",
                }}
              />
            }
            content={
              <AssignmentDialogPage
                course={item.plannable?.content_details?.course_id}
                assignment={item.plannable?.content_details?.id}
              />
            }
          />
        </>
      )}

      <a
        href={
          item.plannable_type == "planner_note"
            ? `/app/todo/${item.plannable_id}`
            : `/app${item.html_url?.split("/submissions")[0]}`
        }
        onClick={handleClick}
        className={cn(
          "block transition-all",
          markedCompleted && "opacity-50 hover:opacity-100",
        )}
      >
        <div
          className="relative cursor-pointer rounded-xs p-2 pl-4 text-xs transition-colors hover:shadow-md"
          style={{
            backgroundColor: `color-mix(in oklab, ${course ? subjectColors(course.classification ?? "") : "var(--ui-muted-foreground)"}, transparent 90%)`,
          }}
        >
          <div
            className="absolute top-1 bottom-1 left-1 w-1 rounded-full"
            style={{
              backgroundColor: course
                ? subjectColors(course.classification ?? "")
                : "var(--ui-muted-foreground)",
            }}
          ></div>
          <div className="mb-1 flex items-center gap-2">
            <Checkbox
              className="size-6 cursor-pointer rounded-full [&:not([data-state=checked])_svg]:opacity-30"
              checked={markedCompleted}
              onClick={async (evt) => {
                evt.preventDefault();
                evt.stopPropagation();

                const checked = !markedCompleted;
                const markAsChecked = () => {
                  setTodoItems((prev) =>
                    prev.map((todoItem) =>
                      todoItem.plannable_id == item.plannable_id
                        ? ({
                            ...todoItem,
                            planner_override: {
                              ...todoItem.planner_override,
                              marked_complete: checked,
                            },
                          } as PlannerItem)
                        : todoItem,
                    ),
                  );
                };
                setRequests(requests + 1);
                setTimeout(() => {
                  markAsChecked();
                }, 100);
                setTimeout(() => {
                  (async () => {
                    setRequests(requests - 1);
                    if (requests == 0) {
                      await fetch("/api/todo/mark-complete", {
                        method: "PUT",
                        body: JSON.stringify({
                          id: Number(item.plannable_id),
                          complete: checked,
                        }),
                      }).catch(console.error);
                      markAsChecked();
                    }
                  })().catch(console.error);
                }, 2000);
              }}
            />
            <span className="relative flex-1 truncate font-bold">
              {/* Strikethrough effect like in TodoItem */}
              <div
                className={cn(
                  "bg-primary absolute top-1/2 left-0 h-0.5 w-0 -translate-y-1/2 rounded-full transition-all",
                  markedCompleted && "w-full",
                )}
              />
              <div
                className={cn(
                  "max-w-full truncate overflow-hidden transition-all",
                  markedCompleted && "scale-90 opacity-50",
                )}
              >
                {item.plannable?.title || "Untitled"}
              </div>
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            {course ? (
              <>
                <SubjectIcon
                  subject={course.classification ?? ""}
                  className="size-4 shrink-0"
                />{" "}
                <span className="flex-1 truncate">
                  {course.classification} ({course.original_name})
                </span>
              </>
            ) : (
              <span className="italic">
                <div className="size-4 shrink-0" />
                No course
              </span>
            )}
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <span className="text-xs">
              Due{" "}
              {formatDuration(
                Temporal.Instant.from(new Date().toISOString()).until(
                  Temporal.Instant.from(
                    new Date(
                      item.plannable?.due_at ?? item.plannable_date ?? "",
                    ).toISOString(),
                  ),
                ),
                {
                  minUnit: "second",
                  maxUnit: "day",
                  maxUnits: 1,
                  style: "medium",
                },
              )}{" "}
            </span>
            {" — at "}
            {new Date(
              item.plannable?.due_at ?? item.plannable_date ?? "",
            ).toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div className="text-muted-foreground flex flex-col items-center gap-1 text-xs">
            <span className="flex w-full items-center gap-1">
              <PrettyState
                className="size-3"
                state={
                  item.plannable?.content_details?.submission?.workflow_state ??
                  ""
                }
              />
            </span>
            <span className="flex w-full items-center justify-end gap-1">
              {item.plannable?.content_details?.points_possible
                ? item.plannable?.content_details?.submission?.score !=
                  undefined
                  ? Number(
                      Number(
                        item.plannable?.content_details?.submission?.score,
                      )?.toFixed(2),
                    )
                  : "—"
                : "—"}{" "}
              / {item.plannable?.content_details?.points_possible ?? "—"} pts
            </span>
            {item.plannable_type == "planner_note" ? (
              <LinkModal
                link={`/app/todo/${item.plannable_id}`}
                stopPropagation
                trigger={
                  <Button
                    variant="link"
                    className="text-muted-foreground h-4 text-xs"
                  >
                    <Eye className="size-3" />
                    View Note
                  </Button>
                }
                title="Planner Note"
                description="View this planner note"
                breadcrumbs={
                  <Breadcrumbs
                    pathname={`/app/todo/${item.plannable_id}`}
                    params={{
                      id: item.plannable_id.toString(),
                    }}
                  />
                }
                content={<TodoItemModalPage id={Number(item.plannable_id)} />}
              />
            ) : (
              <LinkModal
                link={`/app${item.html_url?.split("/submissions")[0]}`}
                stopPropagation
                onOpenChange={(open) => {
                  if (!open) {
                    // Add a small delay before clearing the state to prevent
                    // the assignment modal from opening when backdrop is clicked
                    setTimeout(() => {
                      setSubmissionModalOpen(false);
                    }, 100);
                  } else {
                    setSubmissionModalOpen(true);
                  }
                }}
                trigger={
                  <Button
                    variant="link"
                    className="text-muted-foreground h-4 text-xs"
                  >
                    <Upload className="size-3" />
                    Upload
                  </Button>
                }
                title="Assignment"
                description="Start working on this assignment"
                breadcrumbs={
                  <Breadcrumbs
                    pathname={`/app${item.html_url?.split("/submissions")[0]}`}
                    params={{
                      course:
                        item.plannable?.content_details?.course_id?.toString() ??
                        "",
                      assignment:
                        item.plannable?.content_details?.id?.toString() ?? "",
                    }}
                  />
                }
                content={
                  <SubmissionDialogPage
                    course={item.plannable?.content_details?.course_id}
                    assignment={item.plannable?.content_details?.id}
                  />
                }
              />
            )}
          </div>
        </div>
      </a>
    </div>
  );
}

export function CourseTodoCard({
  course,
  item,
}: {
  course: Course;
  item: PlannerItem;
}) {
  const { setTodoItems } = useTodoItems();
  const [requests, setRequests] = useState(0);

  const markedCompleted = !!(
    item.planner_override?.marked_complete ??
    (item.plannable?.content_details?.submission?.workflow_state ===
      "submitted" ||
      item.plannable?.content_details?.submission?.workflow_state ===
        "graded" ||
      false)
  );

  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  const noteTriggerId = `note-trigger-${item.plannable_id}`;
  const submissionTriggerId = `submission-trigger-${item.plannable_id}`;
  const assignmentTriggerId = `assignment-trigger-${item.plannable_id}`;

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest('[role="dialog"]') ||
      target.closest(".checkbox") ||
      (item.plannable_type !== "planner_note" && submissionModalOpen)
    ) {
      return;
    }
    e.preventDefault();
    if (item.plannable_type === "planner_note") {
      document.getElementById(noteTriggerId)?.click();
    } else {
      document.getElementById(assignmentTriggerId)?.click();
    }
  };

  return (
    <div
      key={item.plannable_id}
      className={cn("relative flex w-full flex-1 flex-col transition-all")}
    >
      {item.plannable_type === "planner_note" ? (
        <LinkModal
          link={`/app/todo/${item.plannable_id}`}
          trigger={
            <button
              id={noteTriggerId}
              style={{ display: "none" }}
              aria-hidden="true"
            />
          }
          title="Planner Note"
          description="View this planner note"
          breadcrumbs={
            <Breadcrumbs
              pathname={`/app/todo/${item.plannable_id}`}
              params={{
                id: item.plannable_id.toString(),
              }}
            />
          }
          content={<TodoItemModalPage id={Number(item.plannable_id)} />}
        />
      ) : (
        <>
          <LinkModal
            link={`/app${item.html_url?.split("/submissions")[0]}`}
            trigger={
              <button
                id={submissionTriggerId}
                style={{ display: "none" }}
                aria-hidden="true"
              />
            }
            title="Assignment"
            description="Start working on this assignment"
            onOpenChange={(open) => {
              if (!open) {
                setTimeout(() => {
                  setSubmissionModalOpen(false);
                }, 100);
              } else {
                setSubmissionModalOpen(true);
              }
            }}
            breadcrumbs={
              <Breadcrumbs
                pathname={`/app${item.html_url?.split("/submissions")[0]}`}
                params={{
                  course:
                    item.plannable?.content_details?.course_id?.toString() ??
                    "",
                  assignment:
                    item.plannable?.content_details?.id?.toString() ?? "",
                }}
              />
            }
            content={
              <SubmissionDialogPage
                course={item.plannable?.content_details?.course_id}
                assignment={item.plannable?.content_details?.id}
              />
            }
          />
          <LinkModal
            link={`/app${item.html_url?.split("/submissions")[0]}`}
            trigger={
              <button
                id={assignmentTriggerId}
                style={{ display: "none" }}
                aria-hidden="true"
              />
            }
            title="Assignment"
            description="View this assignment"
            breadcrumbs={
              <Breadcrumbs
                pathname={`/app${item.html_url?.split("/submissions")[0]}`}
                params={{
                  course:
                    item.plannable?.content_details?.course_id?.toString() ??
                    "",
                  assignment:
                    item.plannable?.content_details?.id?.toString() ?? "",
                }}
              />
            }
            content={
              <AssignmentDialogPage
                course={item.plannable?.content_details?.course_id}
                assignment={item.plannable?.content_details?.id}
              />
            }
          />
        </>
      )}

      <a
        href={
          item.plannable_type === "planner_note"
            ? `/app/todo/${item.plannable_id}`
            : `/app${item.html_url?.split("/submissions")[0]}`
        }
        onClick={handleClick}
        className={cn(
          "block transition-all",
          markedCompleted && "opacity-50 hover:opacity-100",
        )}
      >
        <div
          className="relative cursor-pointer rounded-xs p-2 pl-4 text-xs transition-colors hover:shadow-md"
          style={{
            backgroundColor: `color-mix(in oklab, ${course ? subjectColors(course.classification ?? "") : "var(--ui-muted-foreground)"}, transparent 90%)`,
          }}
        >
          <div
            className="absolute top-1 bottom-1 left-1 w-1 rounded-full"
            style={{
              backgroundColor: course
                ? subjectColors(course.classification ?? "")
                : "var(--ui-muted-foreground)",
            }}
          ></div>
          <div className="mb-1 flex items-center gap-2">
            <Checkbox
              className="size-6 cursor-pointer rounded-full [&:not([data-state=checked])_svg]:opacity-30"
              checked={markedCompleted}
              onClick={async (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                const checked = !markedCompleted;
                const markAsChecked = () => {
                  setTodoItems((prev) =>
                    prev.map((todoItem) =>
                      todoItem.plannable_id === item.plannable_id
                        ? ({
                            ...todoItem,
                            planner_override: {
                              ...todoItem.planner_override,
                              marked_complete: checked,
                            },
                          } as PlannerItem)
                        : todoItem,
                    ),
                  );
                };
                setRequests(requests + 1);
                setTimeout(() => {
                  markAsChecked();
                }, 100);
                setTimeout(() => {
                  (async () => {
                    setRequests(requests - 1);
                    // if (requests == 0) {
                    await fetch("/api/todo/mark-complete", {
                      method: "PUT",
                      body: JSON.stringify({
                        id: Number(item.plannable_id),
                        complete: checked,
                      }),
                    }).catch(console.error);
                    markAsChecked();
                    // }
                  })().catch(console.error);
                }, 2000);
              }}
            />
            <span className="relative flex-1 truncate font-bold">
              <div
                className={cn(
                  "bg-primary absolute top-1/2 left-0 h-0.5 w-0 -translate-y-1/2 rounded-full transition-all",
                  markedCompleted && "w-full",
                )}
              />
              <div
                className={cn(
                  "max-w-full truncate overflow-hidden transition-all",
                  markedCompleted && "scale-90 opacity-50",
                )}
              >
                {item.plannable?.title || "Untitled"}
              </div>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <span className="text-xs">
                  Due{" "}
                  {formatDuration(
                    Temporal.Instant.from(new Date().toISOString()).until(
                      Temporal.Instant.from(
                        new Date(
                          item.plannable?.due_at ?? item.plannable_date ?? "",
                        ).toISOString(),
                      ),
                    ),
                    {
                      minUnit: "second",
                      maxUnit: "day",
                      maxUnits: 1,
                      style: "medium",
                    },
                  )}{" "}
                </span>
                {" — at "}
                {new Date(
                  item.plannable?.due_at ?? item.plannable_date ?? "",
                ).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
              <span className="flex w-full items-center gap-1">
                <PrettyState
                  className="size-3"
                  state={
                    item.plannable?.content_details?.submission
                      ?.workflow_state ?? ""
                  }
                />
              </span>
            </div>
            <div className="text-muted-foreground flex flex-col items-center justify-end gap-1 text-xs">
              <span className="flex w-full items-center justify-end gap-1">
                {item.plannable?.content_details?.points_possible
                  ? item.plannable?.content_details?.submission?.score !=
                    undefined
                    ? Number(
                        Number(
                          item.plannable?.content_details?.submission?.score,
                        )?.toFixed(2),
                      )
                    : "—"
                  : "—"}{" "}
                / {item.plannable?.content_details?.points_possible ?? "—"} pts
              </span>
              {item.plannable_type == "planner_note" ? (
                <LinkModal
                  link={`/app/todo/${item.plannable_id}`}
                  stopPropagation
                  trigger={
                    <Button
                      variant="link"
                      className="text-muted-foreground h-4 !px-0 text-xs"
                    >
                      <Eye className="size-3" />
                      View Note
                    </Button>
                  }
                  title="Planner Note"
                  description="View this planner note"
                  breadcrumbs={
                    <Breadcrumbs
                      pathname={`/app/todo/${item.plannable_id}`}
                      params={{
                        id: item.plannable_id.toString(),
                      }}
                    />
                  }
                  content={<TodoItemModalPage id={Number(item.plannable_id)} />}
                />
              ) : (
                <LinkModal
                  link={`/app${item.html_url?.split("/submissions")[0]}`}
                  stopPropagation
                  onOpenChange={(open) => {
                    if (!open) {
                      setTimeout(() => {
                        setSubmissionModalOpen(false);
                      }, 100);
                    } else {
                      setSubmissionModalOpen(true);
                    }
                  }}
                  trigger={
                    <Button
                      variant="link"
                      className="text-muted-foreground h-4 !px-0 text-xs"
                    >
                      <Upload className="size-3" />
                      Upload
                    </Button>
                  }
                  title="Assignment"
                  description="Start working on this assignment"
                  breadcrumbs={
                    <Breadcrumbs
                      pathname={`/app${item.html_url?.split("/submissions")[0]}`}
                      params={{
                        course:
                          item.plannable?.content_details?.course_id?.toString() ??
                          "",
                        assignment:
                          item.plannable?.content_details?.id?.toString() ?? "",
                      }}
                    />
                  }
                  content={
                    <SubmissionDialogPage
                      course={item.plannable?.content_details?.course_id}
                      assignment={item.plannable?.content_details?.id}
                    />
                  }
                />
              )}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
