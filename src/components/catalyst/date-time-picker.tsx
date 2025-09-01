"use client";

import { Calendar1, Pencil } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
  ResponsivePopover,
  ResponsivePopoverTrigger,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
  ResponsivePopoverDescription,
} from "./responsible-popover";
import { Time } from "./time";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

export function DateTimePicker({
  defaultDate,
  setDate,
  custom = false,
  children,
  side = "bottom",
  align = "start",
}: {
  defaultDate?: string;
  setDate: (date: Date) => void;
  custom?: boolean;
  children?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) {
  const [dateDate, setDateDate] = useState<Date | undefined>(
    defaultDate ? new Date(defaultDate) : undefined,
  );
  const [timeDate, setTimeDate] = useState<Date | undefined>(
    defaultDate ? new Date(defaultDate) : undefined,
  );
  const date = useMemo(() => {
    const d = new Date();
    if (dateDate && timeDate) {
      d.setFullYear(dateDate.getFullYear());
      d.setMonth(dateDate.getMonth());
      d.setDate(dateDate.getDate());
      d.setHours(timeDate.getHours());
      d.setMinutes(timeDate.getMinutes());
      d.setSeconds(timeDate.getSeconds());
    }
    return d;
  }, [timeDate, dateDate]);

  useEffect(() => {
    setDate(date);
  }, [date, setDate]);

  return (
    <ResponsivePopover>
      <ResponsivePopoverTrigger asChild>
        {custom ? (
          children
        ) : (
          <Button variant="outline" className="flex-1 justify-between">
            <div className="flex items-center gap-2">
              <Calendar1 /> {date?.toLocaleString() ?? "No Date Set"}{" "}
            </div>
            <Pencil className="ml-4" />
          </Button>
        )}
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent
        className="@container max-h-96 w-[60ch] justify-stretch overflow-hidden"
        side={side}
        align={align}
      >
        <ResponsivePopoverHeader>
          <ResponsivePopoverTitle>Modify Due Date</ResponsivePopoverTitle>
          <ResponsivePopoverDescription>
            Select a new due date for this todo item.
          </ResponsivePopoverDescription>
        </ResponsivePopoverHeader>
        <div
          className="flex max-h-80 flex-col gap-4 overflow-hidden @xs:flex-row"
          onWheel={(e) => e.stopPropagation()}
        >
          <Calendar
            mode="single"
            selected={dateDate}
            onSelect={setDateDate}
            fixedWeeks
          />
          <Time selected={timeDate} onSelect={setTimeDate} includeSeconds />
        </div>
      </ResponsivePopoverContent>
    </ResponsivePopover>
  );
}
