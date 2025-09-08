"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar1,
  Check,
  Loader,
  MoreHorizontal,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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

export default function ScheduleDatesPage({
  schoolId,
  schedules,
  dates: defaultDates,
  datesSchedule: defaultDatesSchedule,
}: {
  schoolId: string;
  schedules: { id: string; name: string }[];
  dates: { date: Date; scheduleId: string }[];
  datesSchedule: { repeat: number; scheduleId: string }[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dates, setDates] = useState(
    defaultDates.map((d) => {
      const date = new Date(d.date);
      date.setUTCHours(date.getTimezoneOffset() / 60, 0, 0, 0);
      return { ...d, date };
    }),
  );
  const [datesSchedule, setDatesSchedule] = useState(defaultDatesSchedule);
  const [saving, setSaving] = useState(false);

  return (
    <div className="flex flex-col gap-4 @4xl:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <div className="@container">
          <h2 className="mt-2 mb-6 flex items-center gap-2 font-bold">
            <Calendar1 /> Schedule Dates
          </h2>
          <div className="flex flex-col gap-6">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day, index) => (
              <label
                className="flex w-full flex-col items-center justify-between gap-2 @lg:flex-row"
                key={day}
              >
                <span>{day}</span>
                <Combobox
                  className="w-full max-w-full @lg:max-w-[40ch]"
                  placeholders={{
                    emptyValue: "Add a schedule...",
                  }}
                  onSelect={(value) => {
                    setDatesSchedule((prev) =>
                      prev.map((d) =>
                        d.repeat == index ? { ...d, scheduleId: value } : d,
                      ),
                    );
                  }}
                  value={
                    datesSchedule.find((d) => d.repeat == index)?.scheduleId
                  }
                  groups={[
                    {
                      id: day,
                      header: "",
                      values: [
                        { id: "", render: "No Schedule" },
                        ...schedules.map((schedule) => ({
                          id: schedule.id,
                          render: schedule.name,
                        })),
                      ],
                    },
                  ]}
                />
              </label>
            ))}
            <div>
              <h2 className="mt-2 flex items-center gap-2 font-bold">
                <MoreHorizontal /> Other Settings
              </h2>
            </div>
            <div className="-mt-2 flex items-center justify-start gap-4">
              <Button
                variant="link"
                href={`/app/schools/${schoolId}/manage/periods`}
                className="text-muted-foreground h-auto p-0 text-xs"
              >
                Manage Periods
              </Button>
              <Button
                variant="link"
                href={`/app/schools/${schoolId}/manage/schedules`}
                className="text-muted-foreground h-auto p-0 text-xs"
              >
                Manage Schedules
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-2 mb-3 flex items-center justify-between gap-2">
          <Button variant="outline" href={`/app/schools/${schoolId}/manage`}>
            <ArrowLeft />
            Back
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              await fetch("/api/catalyst/schools/schedules/dates/list/set", {
                method: "POST",
                body: JSON.stringify({
                  id: schoolId,
                  dates: dates.map((d) => {
                    const newDate = new Date(d.date);
                    newDate.setUTCHours(0, 0, 0, 0);

                    return {
                      date: newDate.toISOString(),
                      scheduleId: d.scheduleId,
                    };
                  }),
                }),
              });
              await fetch(
                "/api/catalyst/schools/schedules/dates/schedule/set",
                {
                  method: "POST",
                  body: JSON.stringify({
                    id: schoolId,
                    dates: datesSchedule.map((d) => ({
                      repeat: d.repeat,
                      scheduleId: d.scheduleId,
                    })),
                  }),
                },
              );
              setSaving(false);
            }}
            disabled={saving}
          >
            {saving ? (
              <>
                Saving... <Loader className="animate-spin" />
              </>
            ) : (
              <>
                Save
                <Save />
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="border-border flex h-auto flex-col gap-1 overflow-hidden rounded-xs border @4xl:h-auto @4xl:flex-1">
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
            twoWeeksLater.setDate(today.getDate() + 28);
            return date < today || date > twoWeeksLater;
          }}
          onMonthChange={(month) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const twoWeeksLater = new Date(today);
            twoWeeksLater.setDate(today.getDate() + 28);

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
                    schedules.findIndex(
                      (s) => s.id == daySchedule?.scheduleId,
                    ) % colors.length
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
              <Button
                variant="outline"
                className="ml-auto h-auto text-xs"
                onClick={() => {
                  setDates((prev) =>
                    prev.filter(
                      (d) =>
                        d.date.toISOString() != selectedDate?.toISOString(),
                    ),
                  );
                }}
                disabled={selectedDate == undefined}
              >
                Deselect <X />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="ml-auto h-auto text-xs"
                onClick={() => {
                  setDates((prev) =>
                    prev.some(
                      (d) =>
                        d.date.toISOString() == selectedDate?.toISOString(),
                    )
                      ? prev.map((d) =>
                          d.date.toISOString() == selectedDate?.toISOString()
                            ? { ...d, scheduleId: "" }
                            : d,
                        )
                      : [...prev, { date: selectedDate!, scheduleId: "" }],
                  );
                }}
                disabled={selectedDate == undefined}
              >
                Apply <Check />
              </Button>
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
                <Button
                  variant="outline"
                  className="ml-auto h-auto text-xs"
                  onClick={() => {
                    setDates((prev) =>
                      prev.filter(
                        (d) =>
                          d.date.toISOString() != selectedDate?.toISOString(),
                      ),
                    );
                  }}
                  disabled={selectedDate == undefined}
                >
                  Deselect <X />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="ml-auto h-auto text-xs"
                  onClick={() => {
                    setDates((prev) =>
                      prev.some(
                        (d) =>
                          d.date.toISOString() == selectedDate?.toISOString(),
                      )
                        ? prev.map((d) =>
                            d.date.toISOString() == selectedDate?.toISOString()
                              ? { ...d, scheduleId: schedule.id }
                              : d,
                          )
                        : [
                            ...prev,
                            { date: selectedDate!, scheduleId: schedule.id },
                          ],
                    );
                  }}
                  disabled={selectedDate == undefined}
                >
                  Apply <Check />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
