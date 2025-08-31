"use client";

import { useContext, useState } from "react";
import { SetStateForOpenDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { TextEditor } from "@/components/editor/editor.dynamic";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FeedbackRenderer({ email }: { email: string }) {
  const [importance, setImportance] = useState("low");
  const [category, setCategory] = useState("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const pathname = usePathname();
  const [saving, setSaving] = useState(false);
  const setDialogOpen = useContext(SetStateForOpenDialog);

  return (
    <>
      <h1 className="h1">Feedback</h1>
      <div className="flex flex-col gap-6 pt-4 pb-12">
        <div className="flex flex-col gap-2 rounded-sm border p-2 pl-4">
          <span className="text-muted-foreground text-xs font-bold">
            Classification Information
          </span>
          <label className="flex items-center gap-2">
            <span className="w-full md:w-36">Category</span>
            <Select onValueChange={(val) => setCategory(val)} value={category}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="visual-bug">Visual Bug</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="flex items-center gap-2">
            <span className="w-full md:w-36">Importance</span>
            <Select
              onValueChange={(val) => setImportance(val)}
              value={importance}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="very">Very</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>
        <div className="flex flex-col gap-2 rounded-sm border p-2 pl-4">
          <span className="text-muted-foreground text-xs font-bold">
            Detailed Information
          </span>
          <label className="flex flex-col items-center gap-1 md:flex-row">
            <span className="w-full md:w-36">Title</span>
            <Input
              className="flex-1"
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            />
          </label>
          <div className="flex flex-col items-center gap-1 md:flex-row">
            <span className="w-full md:w-36">Description</span>
            <div className="flex-1">
              <TextEditor
                className="flex-1"
                content={description}
                setContent={setDescription}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-sm border p-2 pl-4">
          <span className="text-muted-foreground text-xs font-bold">
            Other Imported Information
          </span>
          <label className="flex flex-col items-center gap-1 md:flex-row">
            <span className="w-full md:w-36">Path</span>
            <Input className="flex-1" value={pathname} disabled />
          </label>
          <label className="flex flex-col items-center gap-1 md:flex-row">
            <span className="w-full md:w-36">Email</span>
            <Input className="flex-1" value={email} disabled />
          </label>
        </div>
      </div>
      <Button
        className="fixed right-0 bottom-0 m-4"
        onClick={async () => {
          setSaving(true);
          await fetch("/api/catalyst/feedback/provide", {
            method: "POST",
            body: JSON.stringify({
              title,
              description,
              category,
              importance,
              email,
              pathname,
            }),
          });
          setSaving(false);
          setDialogOpen?.(false);
          setTitle("");
        }}
        disabled={saving || !title}
      >
        {saving ? (
          <>
            Sending... <Loader className="animate-spin" />
          </>
        ) : (
          <>
            Send <ArrowRight />
          </>
        )}
      </Button>
    </>
  );
}
