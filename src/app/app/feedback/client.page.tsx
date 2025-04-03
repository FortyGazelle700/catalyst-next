"use client";

import { useContext, useState } from "react";
import { SetStateForOpenDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function FeedbackRenderer() {
  const [title, setTitle] = useState("false");

  return (
    <>
      <h1 className="h1">Feedback</h1>
      <div className="pt-4 pb-12 flex flex-col gap-6">
        <label className="flex gap-1 items-center md:flex-row flex-col">
          <span className="w-full md:w-36">Name</span>
          <Input
            className="flex-1"
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
          />
        </label>
      </div>
      <Button
        className="fixed bottom-0 right-0 m-4"
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
