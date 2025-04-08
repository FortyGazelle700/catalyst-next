"use client";

import { useContext, useEffect, useState } from "react";
import { SetStateForOpenDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { TextEditor } from "@/components/editor/editor";
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
      <div className="pt-4 pb-12 flex flex-col gap-6">
        <div className="p-2 rounded-sm flex flex-col gap-2 border pl-4">
          <span className="font-bold text-xs text-muted-foreground">
            Classification Information
          </span>
          <label className="flex gap-2 items-center">
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
          <label className="flex gap-2 items-center">
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
        <div className="p-2 rounded-sm flex flex-col gap-2 border pl-4">
          <span className="font-bold text-xs text-muted-foreground">
            Detailed Information
          </span>
          <label className="flex gap-1 items-center md:flex-row flex-col">
            <span className="w-full md:w-36">Title</span>
            <Input
              className="flex-1"
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            />
          </label>
          <div className="flex gap-1 items-center md:flex-row flex-col">
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
        <div className="p-2 rounded-sm flex flex-col gap-2 border pl-4">
          <span className="font-bold text-xs text-muted-foreground">
            Other Imported Information
          </span>
          <label className="flex gap-1 items-center md:flex-row flex-col">
            <span className="w-full md:w-36">Path</span>
            <Input className="flex-1" value={pathname} disabled />
          </label>
          <label className="flex gap-1 items-center md:flex-row flex-col">
            <span className="w-full md:w-36">Email</span>
            <Input className="flex-1" value={email} disabled />
          </label>
        </div>
      </div>
      <Button
        className="fixed bottom-0 right-0 m-4"
        onClick={async () => {
          setSaving(true);
          await fetch("/api/todo/create", {
            method: "POST",
            body: JSON.stringify({
              title,
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
