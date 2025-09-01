"use client";

import { type PlannerNote } from "@/server/api/canvas/types";
import { Temporal } from "@js-temporal/polyfill";
import { CalendarCheck, Dot, Pencil, Timer } from "lucide-react";
import { useContext } from "react";
import { TimeContext } from "../../layout.providers";
import { formatDuration } from "@/components/catalyst/format-duration";
import { Button } from "@/components/ui/button";
import { LinkModal } from "@/components/catalyst/link-modal";
import { Breadcrumbs } from "../../breadcrumbs";
import CreateTodoItemModalPage from "./edit/page.modal";
import DOMPurify from "dompurify";
import { marked } from "marked";

export function TodoItemRenderer({ todoItem }: { todoItem: PlannerNote }) {
  const now = useContext(TimeContext);

  return (
    <>
      <h1 className="h1">{todoItem.title}</h1>
      <div className="flex gap-2 px-6 py-2 bg-secondary rounded-full -mx-4">
        <div className="flex gap-1 items-center">
          <CalendarCheck className="size-3" />
          <span className="text-xs">
            Due on{" "}
            {Temporal.Instant.from(
              new Date(todoItem.todo_date ?? "").toISOString()
            ).toLocaleString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}{" "}
            at{" "}
            {Temporal.Instant.from(
              new Date(todoItem.todo_date ?? "").toISOString()
            ).toLocaleString(undefined, {
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </div>
        <Dot className="size-3" />
        <div className="flex gap-1 items-center">
          <Timer className="size-3" />
          <span className="text-xs">
            Due in{" "}
            {formatDuration(
              Temporal.Instant.from(
                Temporal.Instant.from(now.toISOString())
              ).until(new Date(todoItem.todo_date ?? "").toISOString()),
              {
                minUnit: "second",
                maxUnit: "day",
                maxUnits: 3,
              }
            )}
          </span>
        </div>
      </div>
      <p
        className="mt-4"
        dangerouslySetInnerHTML={{
          __html: marked.parse(
            DOMPurify.sanitize(todoItem.details ?? "No description provided")
          ) as string,
        }}
      ></p>
      <LinkModal
        link={`/app/todo/${todoItem.id}/edit`}
        trigger={
          <Button className="fixed bottom-0 right-0 m-4">
            <Pencil />
            <span>Edit</span>
          </Button>
        }
        title="Edit Todo Item"
        description="Edit this planner note"
        breadcrumbs={
          <Breadcrumbs
            pathname={`/app/todo/${todoItem.id}/edit`}
            params={{
              id: todoItem.id.toString(),
            }}
          />
        }
        content={<CreateTodoItemModalPage id={todoItem.id.toString()} />}
      />
    </>
  );
}
