"use client";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { buttonVariants } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
const colors = [
  "oklch(0.64 0.21 25)",
  "oklch(0.77 0.16 70)",
  "oklch(0.77 0.20 131)",
  "oklch(0.70 0.15 162)",
  "oklch(0.71 0.13 215)",
  "oklch(0.62 0.19 260)",
  "oklch(0.61 0.22 293)",
  "oklch(0.67 0.26 322)",
  "oklch(0.65 0.22 16)",
];

export default function CalendarView({
  dates: defaultDates,
  datesSchedule,
  schedules,
}: {
  dates: {
    id: string;
    schoolId: string;
    scheduleId: string;
    date: Date;
    createdAt: Date | null;
    updatedAt: Date | null;
  }[];
  datesSchedule: {
    id: string;
    schoolId: string;
    scheduleId: string;
    repeat: number;
  }[];
  schedules: {
    id: string;
    schoolId: string | null;
    name: string;
    createdAt: Date | null;
    updatedAt: Date | null;
  }[];
}) {
  const dates = useMemo(
    () =>
      defaultDates.map((d) => {
        const date = new Date(d.date);
        date.setUTCHours(date.getTimezoneOffset() / 60, 0, 0, 0);
        return { ...d, date };
      }),
    [defaultDates],
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(d) => d && setSelectedDate(d)}
        className="mx-auto w-max"
        fromMonth={new Date(new Date().setMonth(new Date().getMonth() - 1))}
        toMonth={new Date(new Date().setMonth(new Date().getMonth() + 1))}
        disabled={(date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const twoWeeksLater = new Date(today);
          twoWeeksLater.setDate(today.getDate() + 14);
          return date < today || date > twoWeeksLater;
        }}
        onMonthChange={(month) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const twoWeeksLater = new Date(today);
          twoWeeksLater.setDate(today.getDate() + 14);

          const firstDayOfMonth = new Date(
            month.getFullYear(),
            month.getMonth(),
            1,
          );
          const lastDayOfMonth = new Date(
            month.getFullYear(),
            month.getMonth() + 1,
            0,
          );

          if (lastDayOfMonth < today || firstDayOfMonth > twoWeeksLater) {
            return false;
          }
          return true;
        }}
        classNames={{
          root: "w-full h-full min-h-[28rem] flex flex-col",
          table: "w-full h-full flex-1",
          head: "flex items-center justify-between gap-1 w-full [&>tr]:w-full",
          head_cell:
            "w-14 h-4 p-0 text-muted-foreground text-xs font-normal flex flex-1 pl-2",
          cell: "h-14 w-14 p-0",
          day: "w-full h-full flex items-center justify-center cursor-pointer rounded-md transition-all aria-selected:bg-transparent aria-selected:text-accent-foreground outline-transparent outline-2 aria-selected:outline-offset-2 aria-selected:outline-primary",
          day_today: "!bg-accent text-accent-foreground",
          day_disabled: "!opacity-10 !cursor-not-allowed",
          day_outside: "text-foreground opacity-50",
          nav: "flex items-center gap-1 h-10 gap-1",
          row: "flex w-full gap-1 mt-1",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "size-10 bg-transparent p-0 opacity-50 hover:opacity-100",
          ),
        }}
        fixedWeeks
        weekStartsOn={1}
        components={{
          DayContent: ({ date }: { date: Date }) => {
            let color = "transparent";
            let style = "border";

            const daySchedule = datesSchedule.find(
              (d) => (d.repeat + 1) % 7 == date.getDay(),
            );

            if (daySchedule?.scheduleId != "") {
              color =
                colors[
                  schedules.findIndex((s) => s.id == daySchedule?.scheduleId) %
                    colors.length
                ]!;
              style = "border";
            } else {
              color = "oklch(0.55 0.04 257)";
              style = "border";
            }

            if (
              dates.find(
                (d) => new Date(d.date).toDateString() == date.toDateString(),
              )?.scheduleId
            ) {
              color =
                colors[
                  schedules.findIndex(
                    (s) =>
                      s.id ===
                      dates.find(
                        (d) =>
                          new Date(d.date).toDateString() ===
                          date.toDateString(),
                      )?.scheduleId,
                  ) % colors.length
                ]!;
              style = "fill";
            }

            if (
              dates.find(
                (d) => new Date(d.date).toDateString() == date.toDateString(),
              )?.scheduleId == ""
            ) {
              color = "oklch(0.55 0.04 257)";
              style = "fill";
            }

            return (
              <div
                className="relative flex h-full w-full items-center justify-center"
                onClick={() =>
                  setSelectedDate(date == selectedDate ? date : undefined)
                }
              >
                {date.getDate()}
                {color != "transparent" && (
                  <div
                    className="absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 transform rounded-full"
                    style={
                      style == "fill"
                        ? { backgroundColor: color }
                        : {
                            outlineColor: color,
                            outlineWidth: "2px",
                            outlineStyle: "solid",
                            outlineOffset: "0px",
                          }
                    }
                  />
                )}
              </div>
            );
          },
        }}
      />
      <h2 className="h4 px-4 py-2">Key</h2>
      <div className="mb-4 flex w-full items-center gap-4 px-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="outline-secondary mr-2 size-2 rounded-full outline-2 outline-offset-2" />
          <span className="mr-2">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-secondary size-2 rounded-full" />
          <span className="mr-2">Finalized / Overrode</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-slate-500" />
          <span className="mr-2">No Value</span>
          {dates.some(
            (d) =>
              d.date.toISOString() == selectedDate?.toISOString() &&
              d.scheduleId == "",
          ) ? (
            <div className="ml-auto flex h-8 items-center gap-2 rounded-full border px-4 py-2 text-xs">
              <Check className="size-3" /> Applied
            </div>
          ) : (
            <div className="ml-auto flex h-8 items-center gap-2 rounded-full border px-4 py-2 text-xs opacity-50">
              <X className="size-3" /> Not Applied
            </div>
          )}
        </div>
        {schedules.map((schedule, idx) => (
          <div key={schedule.id} className="flex items-center gap-2">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: colors[idx % colors.length] }}
            />
            <span className="mr-2">{schedule.name}</span>
            {dates.some(
              (d) =>
                d.date.toISOString() == selectedDate?.toISOString() &&
                d.scheduleId == schedule.id,
            ) ? (
              <div className="ml-auto flex h-8 items-center gap-1 rounded-full border px-4 py-2 text-xs">
                <Check className="size-3" /> Applied
              </div>
            ) : (
              <div className="ml-auto flex h-8 items-center gap-1 rounded-full border px-4 py-2 text-xs opacity-50">
                <X className="size-3" /> Not Applied
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
