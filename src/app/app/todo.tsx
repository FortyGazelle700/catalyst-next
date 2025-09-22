"use client";

import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { CoursesContext, TimeContext } from "./layout.providers";
import { type PlannerItem } from "@/server/api/canvas/types";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";

export function TodoItem({
  todoItem,
  setTodoItems,
}: {
  todoItem: PlannerItem;
  setTodoItems: Dispatch<SetStateAction<PlannerItem[]>>;
}) {
  const courses = useContext(CoursesContext);
  const now = useContext(TimeContext);
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
                        id: todoItem.plannable_id,
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
  setTodoItems,
}: {
  date: Date;
  hour: number;
  isToday: boolean;
  now: Date;
  items: PlannerItem[];
  setTodoItems: React.Dispatch<React.SetStateAction<PlannerItem[]>>;
}) {
  const courses = useContext(CoursesContext);

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

  return (
    <div
      key={`${dayKey}-${hour}`}
      className={cn(
        "hover:!bg-primary/5 relative flex min-h-[0.5rem] w-[20rem] flex-col gap-1 border-r p-1 transition-all last:border-r-0",
        (date.getDay() == 0 || date.getDay() == 6) &&
          !isToday &&
          "bg-muted/10 hover:!bg-primary/10",
        isToday && "bg-primary/10 hover:!bg-primary/15",
      )}
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

            return (
              <div key={todoItem.plannable_id}>
                {/* Always render the modal content outside of HoverCard */}
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

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link
                      href={`/app${todoItem.html_url?.split("/submissions")[0]}`}
                      onClick={(evt) => evt.preventDefault()}
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
                        <label
                          className="flex gap-1 font-bold"
                          onClick={async (checked) => {
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
                                      id: todoItem.plannable_id,
                                      complete: checked,
                                    }),
                                  }).catch(console.error);
                                  markAsChecked();
                                }
                              })().catch(console.error);
                            }, 2000);
                          }}
                        >
                          <Checkbox
                            className="size-4 cursor-pointer rounded-full [&_svg]:size-3 [&:not([data-state=checked])_svg]:opacity-30"
                            checked={markedCompleted}
                          />
                          <span className="flex-1 truncate">
                            {course?.classification ?? "Not Assigned"} —{" "}
                            {todoItem.plannable?.title || "Untitled"}
                          </span>
                        </label>
                        <div className="text-muted-foreground text-xs">
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
                            todoItem.plannable?.due_at ??
                              todoItem.plannable_date!,
                          ).toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </div>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-96" side="left" align="end">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">
                        {todoItem.plannable?.title || "Untitled"}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {course?.classification ?? "Not Assigned"} -{" "}
                        {course?.original_name}
                      </p>
                      <div className="mt-4 flex justify-end gap-2">
                        {todoItem.plannable_type == "planner_note" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              document.getElementById(noteTriggerId)?.click()
                            }
                          >
                            View Note
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                document
                                  .getElementById(submissionTriggerId)
                                  ?.click()
                              }
                            >
                              <Upload /> Start Submission
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                document
                                  .getElementById(assignmentTriggerId)
                                  ?.click()
                              }
                            >
                              <Eye /> View Assignment
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
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
            top: `${(now.getMinutes() / 60) * 60}px`,
          }}
        >
          {isCurrentHour && (
            <div className="bg-primary absolute top-1/2 left-0 h-2 w-2 -translate-1/2 rounded-full"></div>
          )}
        </div>
      )}
    </div>
  );
}

export function CalendarTodoCard({
  date,
  item,
  setTodoItems,
}: {
  date: Date;
  item: PlannerItem;
  setTodoItems: React.Dispatch<React.SetStateAction<PlannerItem[]>>;
}) {
  const courses = useContext(CoursesContext);
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

  // Create unique IDs for the modal triggers
  const noteTriggerId = `note-trigger-${item.plannable_id}`;
  const submissionTriggerId = `submission-trigger-${item.plannable_id}`;
  const assignmentTriggerId = `assignment-trigger-${item.plannable_id}`;

  return (
    <div
      key={date.toDateString()}
      className={cn("relative flex w-full flex-col gap-1 p-2 transition-all")}
    >
      <div className="space-y-1">
        <div key={item.plannable_id}>
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

          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href={`/app${item.html_url?.split("/submissions")[0]}`}
                onClick={(evt) => evt.preventDefault()}
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
                  <label className="flex gap-1 font-bold">
                    <Checkbox
                      className="size-4 cursor-pointer rounded-full [&_svg]:size-3 [&:not([data-state=checked])_svg]:opacity-30"
                      checked={markedCompleted}
                      onCheckedChange={async (checked) => {
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
                        markAsChecked();
                        setTimeout(() => {
                          (async () => {
                            setRequests(requests - 1);
                            if (requests == 0) {
                              await fetch("/api/todo/mark-complete", {
                                method: "PUT",
                                body: JSON.stringify({
                                  id: item.plannable_id,
                                  complete: checked,
                                }),
                              }).catch(console.error);
                              markAsChecked();
                            }
                          })().catch(console.error);
                        }, 2000);
                      }}
                    />
                    <span className="flex-1 truncate">
                      {course?.classification ?? "Not Assigned"} —{" "}
                      {item.plannable?.title || "Untitled"}
                    </span>
                  </label>
                  <div className="text-muted-foreground text-xs">
                    <span className="text-xs">
                      Due{" "}
                      {formatDuration(
                        Temporal.Instant.from(new Date().toISOString()).until(
                          Temporal.Instant.from(
                            new Date(
                              item.plannable?.due_at ??
                                new Date().toISOString(),
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
                    {new Date(item.plannable?.due_at ?? "").toLocaleTimeString(
                      undefined,
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      },
                    )}
                  </div>
                </div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-96" side="left" align="end">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  {item.plannable?.title || "Untitled"}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {course?.classification ?? "Not Assigned"} -{" "}
                  {course?.original_name}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  {item.plannable_type == "planner_note" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        document.getElementById(noteTriggerId)?.click()
                      }
                    >
                      View Note
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          document.getElementById(submissionTriggerId)?.click()
                        }
                      >
                        <Upload /> Start Submission
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          document.getElementById(assignmentTriggerId)?.click()
                        }
                      >
                        <Eye /> View Assignment
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}
