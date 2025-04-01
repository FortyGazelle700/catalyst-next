"use client";

import { PlannerNote } from "@/server/api/canvas/types";
import { Loader, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextEditor } from "@/components/editor/editor";
import { useContext, useState } from "react";
import { DateTimePicker } from "@/components/catalyst/date-time-picker";
import { CoursePicker } from "@/components/catalyst/course-picker";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { SetStateForOpenDialog } from "@/components/ui/dialog";

export function TodoEditItemRenderer({ todoItem }: { todoItem: PlannerNote }) {
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(todoItem.title);
  const [description, setDescription] = useState(
    marked.parse(DOMPurify.sanitize(todoItem.details ?? "")) as string
  );
  const [markdown, setMarkdown] = useState("");
  const [date, setDate] = useState<Date | undefined>(
    new Date(todoItem.todo_date)
  );
  const [course, setCourse] = useState<number | undefined>(todoItem.course_id);

  const setDialogOpen = useContext(SetStateForOpenDialog);

  return (
    <>
      <h1 className="h1">Edit Todo Item</h1>
      <div className="pt-4 pb-12 flex flex-col gap-6">
        <label className="flex gap-1 items-center md:flex-row flex-col">
          <span className="w-full md:w-36">Name</span>
          <Input
            className="flex-1"
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
          />
        </label>
        <div className="flex gap-1 items-start md:flex-row flex-col">
          <span className="w-full md:w-36">Description</span>
          <div className="flex-1">
            <TextEditor
              className="flex-1"
              content={description}
              setContent={setDescription}
              setMarkdown={setMarkdown}
            />
          </div>
        </div>
        <label className="flex gap-1 items-center md:flex-row flex-col">
          <span className="w-full md:w-36">Due Date</span>
          <DateTimePicker setDate={setDate} defaultDate={date?.toISOString()} />
        </label>
        <label className="flex gap-1 items-center md:flex-row flex-col">
          <span className="w-full md:w-36">Course</span>
          <CoursePicker
            course={course}
            onSelect={setCourse}
            className="flex-1"
          />
        </label>
      </div>
      <Button
        className="fixed bottom-0 right-0 m-4"
        onClick={async () => {
          setSaving(true);
          await fetch(`/api/todo/edit/${todoItem.id}`, {
            method: "PUT",
            body: JSON.stringify({
              title,
              description: markdown,
              due_at: date?.toISOString(),
              course_id: course,
            }),
          });
          setSaving(false);
          setDialogOpen(false);
        }}
        disabled={saving || !title}
      >
        {saving ? (
          <>
            <Loader className="animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save /> Save
          </>
        )}
      </Button>
    </>
  );
}
