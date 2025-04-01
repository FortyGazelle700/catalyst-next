"use client";

import { useContext, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { CoursesContext } from "@/app/app/layout.providers";
import { cn } from "@/lib/utils";
import { SubjectIcon } from "./subjects";
import { Sub } from "@radix-ui/react-dropdown-menu";

export function CoursePicker({
  course,
  onSelect,
  className,
}: {
  course: number | undefined;
  onSelect: (course: number) => void;
  className?: string;
}) {
  const courses = useContext(CoursesContext);
  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === course),
    [course, courses]
  );

  return (
    <Select value={String(course)} onValueChange={(v) => onSelect(Number(v))}>
      <SelectTrigger className={cn(className)}>
        <div className="flex items-center gap-2">
          <SubjectIcon subject={selectedCourse?.classification ?? ""} />
          {selectedCourse?.classification ?? ""} (
          {selectedCourse?.name ?? "Select a course"})
        </div>
      </SelectTrigger>
      <SelectContent>
        {courses
          .sort((a, b) =>
            (a.period?.periodOrder ?? Infinity) >
            (b.period?.periodOrder ?? Infinity)
              ? 1
              : -1
          )
          .map((c) => (
            <SelectItem value={String(c.id)} key={c.id}>
              <div className="flex gap-2">
                <SubjectIcon
                  subject={c.classification ?? ""}
                  className="mt-1"
                />
                <div className="flex flex-col gap-2">
                  <div className="font-bold">{c.classification}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.period?.periodName ?? "No Period"} - {c.name}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
