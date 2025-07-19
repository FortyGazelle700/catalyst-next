"use client";

import { Loader, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextEditor } from "@/components/editor/editor.dynamic";
import { useContext, useState } from "react";
import { DateTimePicker } from "@/components/catalyst/date-time-picker";
import { CoursePicker } from "@/components/catalyst/course-picker";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { SetStateForOpenDialog } from "@/components/ui/dialog";

export function CreateTodoItemRenderer() {
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    marked.parse(DOMPurify.sanitize("")) as string,
  );
  const [markdown, setMarkdown] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [course, setCourse] = useState<number | undefined>(undefined);

  const setDialogOpen = useContext(SetStateForOpenDialog);

  return (
    <>
      <h1 className="h1">Create Todo Item</h1>
      <div className="flex flex-col gap-6 pt-4 pb-12">
        <label className="flex flex-col items-center gap-1 md:flex-row">
          <span className="w-full md:w-36">Name</span>
          <Input
            className="flex-1"
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
          />
        </label>
        <div className="flex flex-col items-start gap-1 md:flex-row">
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
        <label className="flex flex-col items-center gap-1 md:flex-row">
          <span className="w-full md:w-36">Due Date</span>
          <DateTimePicker setDate={setDate} defaultDate={date?.toISOString()} />
        </label>
        <label className="flex flex-col items-center gap-1 md:flex-row">
          <span className="w-full md:w-36">Course</span>
          <CoursePicker
            course={course}
            onSelect={setCourse}
            className="flex-1"
          />
        </label>
      </div>
      <Button
        className="fixed right-0 bottom-0 m-4"
        onClick={async () => {
          setSaving(true);
          await fetch("/api/todo/create", {
            method: "POST",
            body: JSON.stringify({
              title,
              description: markdown,
              due_at: date?.toISOString(),
              course_id: course,
            }),
          });
          setSaving(false);
          setDialogOpen?.(false);
          setTitle("");
          setDescription("");
          setMarkdown("");
          setDate(undefined);
          setCourse(undefined);
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
