"use client";

import { Dispatch, SetStateAction, useContext, useMemo, useState } from "react";
import { CoursesContext, TimeContext } from "./layout.providers";
import { PlannerItem } from "@/server/api/canvas/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Temporal } from "@js-temporal/polyfill";
import { formatDuration } from "@/components/catalyst/format-duration";
import { LinkModal } from "@/components/catalyst/link-modal";
import {
  PrettyState,
  SubmissionTypeWithIcon,
} from "@/components/catalyst/pretty-state";
import { SubjectIcon } from "@/components/catalyst/subjects";
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
import TodoItemModalPage from "./todo/[id]/modal.page";
import { AssignmentDialogPage } from "./courses/[course]/assignments/[assignment]/page.modal";
import SubmisisonDialogPage from "./courses/[course]/assignments/[assignment]/submission.modal";

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
      course.id == (todoItem.course_id ?? todoItem.plannable.course_id)
  );

  const dueDate = useMemo(
    () => new Date(todoItem.plannable_date ?? todoItem.plannable.due_at ?? ""),
    [todoItem]
  );

  const pastDue = useMemo(
    () => now.getTime() > dueDate.getTime(),
    [dueDate, now]
  );

  return (
    <div
      key={todoItem.plannable_id}
      className="flex @3xl:flex-row flex-col gap-2 h-72 @3xl:h-36 border rounded-md p-2 has-[&[data-state='checked']]:scale-[97%] hover:!scale-100 hover:!opacity-90 has-[&[data-state='checked']]:opacity-50 transition-all"
    >
      <div className="flex flex-col gap-2 flex-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <Checkbox
            className="size-8 rounded-full cursor-pointer"
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
                      : (item as PlannerItem)
                  )
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
                })();
              }, 2000);
            }}
          />
          <h3 className="h3 !mt-0 relative overflow-hidden max-w-[calc(100%-4rem)]">
            <div className="group-has-[&[data-state='checked']]:group-hover:w-[calc(100%-calc(var(--spacing)*2))] group-has-[&[data-state='checked']]:w-full w-0 bg-primary h-0.5 transition-all absolute top-1/2 -translate-y-1/2 rounded-full group-hover:w-2" />
            <div className="group-has-[&[data-state='checked']]:opacity-50 group-hover:opacity-90 transition-all group-has-[&[data-state='checked']]:scale-90 group-hover:scale-95 group-has-[&[data-state='checked']]:group-hover:opacity-60 group-has-[&[data-state='checked']]:group-hover:scale-95 overflow-hidden truncate max-w-full">
              {todoItem.plannable.title}
            </div>
          </h3>
        </label>
        <div className="flex @3xl:flex-row flex-col gap-2">
          <Button
            variant="outline"
            href={`/app/courses/${todoItem.course_id}`}
            className="flex gap-2 rounded-md p-2 text-xs group"
          >
            <SubjectIcon
              subject={course?.classification ?? ""}
              className="size-4"
            />
            <span className="overflow-hidden truncate max-w-[30ch]">
              {course?.classification} ({course?.original_name})
            </span>
            <ArrowRight className="size-4 group-hover:-rotate-45 transition-all" />
          </Button>
          {todoItem.html_url && (
            <Button
              variant="outline"
              href={`/app${todoItem.html_url?.split("/submissions")[0]}`}
              className="flex gap-2 rounded-md p-2 text-xs group"
            >
              <Notebook className="size-4" />
              <span className="overflow-hidden truncate max-w-[30ch]">
                {todoItem.plannable.title}
              </span>
              <ArrowRight className="size-4 group-hover:-rotate-45 transition-all" />
            </Button>
          )}
          {todoItem.plannable_type == "planner_note" && (
            <Button
              variant="outline"
              href={`/app/todo/${todoItem.plannable_id}`}
              className="flex gap-2 rounded-md p-2 text-xs group"
            >
              <StickyNote className="size-4" />
              <span className="overflow-hidden truncate max-w-[30ch]">
                {todoItem.plannable.title}
              </span>
              <ArrowRight className="size-4 group-hover:-rotate-45 transition-all" />
            </Button>
          )}
        </div>
        <div className="flex gap-2 px-4 mt-2 @3xl:flex-row flex-col">
          <div className="flex gap-2 items-center text-xs">
            <Calendar className="size-4" />
            <span>
              Due on{" "}
              {Temporal.Instant.from(
                new Date(
                  todoItem.plannable_date ?? todoItem.plannable.due_at ?? ""
                ).toISOString()
              ).toLocaleString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}{" "}
              at{" "}
              {Temporal.Instant.from(
                new Date(
                  todoItem.plannable_date ?? todoItem.plannable.due_at ?? ""
                ).toISOString()
              ).toLocaleString(undefined, {
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
          </div>
          <Dot className="size-4 stroke-muted-foreground @3xl:block hidden" />
          <div className="flex gap-2 items-center text-xs">
            <Timer className="size-3" />
            <span className="text-xs">
              Due {pastDue ? "" : "in "}
              {formatDuration(
                Temporal.Instant.from(Temporal.Instant.from(now.toISOString()))
                  .until(
                    new Date(
                      todoItem.plannable_date ?? todoItem.plannable.due_at ?? ""
                    ).toISOString()
                  )
                  .abs(),
                {
                  minUnit: "second",
                  maxUnit: "day",
                  maxUnits: 2,
                  style: "medium",
                }
              )}{" "}
              {pastDue ? " ago" : ""}
            </span>
          </div>
          <Dot className="size-4 stroke-muted-foreground @3xl:block hidden" />
          <div className="flex gap-2 items-center text-xs">
            <PrettyState
              className="size-4"
              state={
                todoItem.plannable?.content_details?.submission
                  ?.workflow_state ?? ""
              }
            />
          </div>
          <Dot className="size-4 stroke-muted-foreground @3xl:block hidden" />
          <div className="flex gap-2 items-center text-xs">
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
      <div className="flex flex-row @3xl:flex-col items-end justify-end flex-shrink-0">
        <div className="flex items-start justify-start @3xl:justify-end flex-1 gap-2">
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
                  <SubmisisonDialogPage
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
        <div className="flex flex-row @3xl:flex-col items-center @3xl:items-end justify-end">
          <div className="text-xl font-bold text-muted-foreground inline-flex gap-2 items-center pr-4">
            {todoItem.plannable.content_details?.points_possible ? (
              <>
                {todoItem.plannable.content_details.submission?.score !=
                undefined ? (
                  Number(
                    Number(
                      todoItem.plannable.content_details.submission?.score
                    )?.toFixed(2)
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
          <div className="text-4xl font-bold inline-flex gap-1 items-center">
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
