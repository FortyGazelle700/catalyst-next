"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Api } from "@/server/api";
import {
  ArrowLeft,
  Kanban,
  Plus,
  Save,
  WrapText,
  Loader,
  Trash,
  GripVertical,
  Minus,
} from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reorder, useDragControls } from "motion/react";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "@/components/ui/combobox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Options = {
  schoolId: string;
  periods: Awaited<
    ReturnType<
      Awaited<ReturnType<Api>>["catalyst"]["schools"]["periods"]["list"]
    >
  >["data"];
  schedules: Awaited<
    ReturnType<
      Awaited<
        ReturnType<Api>
      >["catalyst"]["schools"]["schedules"]["detailedList"]
    >
  >["data"];
};

export default function PeriodsPageClient({
  schoolId,
  periods,
  schedules: defaultSchedules,
}: Options) {
  const [schedules, setSchedules] = useState(defaultSchedules);
  const [saving, setSaving] = useState(false);
  const [tzOffset, setTzOffset] = useState(0);
  const [observeDST, setObserveDST] = useState(false);
  const [use24HourMode, setUse24HourMode] = useState(false);

  useEffect(() => {
    setTzOffset(new Date().getTimezoneOffset() / -60);
  }, []);

  return (
    <div className="flex flex-col gap-4 @5xl:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h2 className="mt-2 flex items-center gap-2 font-bold">
            <Kanban /> Schedules
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            Standard Schedules
            <Input
              value={schedules.length}
              type="number"
              min={0}
              max={20}
              onChange={(evt) => {
                const value = Math.min(
                  Math.max(Number(evt.target.value), 0),
                  20,
                );
                let length = schedules.length;
                if (value > length) {
                  while (length < value) {
                    length++;
                    setSchedules((prev) => [
                      ...prev,
                      {
                        periods: [],
                        schoolId: schoolId,
                        id: crypto.randomUUID(),
                        name: `Standard ${length}`,
                      },
                    ]);
                  }
                } else if (value < length) {
                  while (length > value) {
                    length--;
                    setSchedules((prev) => prev.slice(0, -1));
                  }
                }
              }}
              placeholder="7"
              className="text-foreground"
            />
            <span className="text-muted-foreground text-xs">
              Schedules are used to classify a specific day with a set of
              periods and corresponding times. Whenever you have a day with
              different periods or different times for those periods, you can
              create a new schedule.
            </span>
          </label>
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            <div className="flex items-center justify-between gap-2">
              Use 24-hour mode
              <Switch
                checked={use24HourMode}
                onCheckedChange={setUse24HourMode}
              />
            </div>
            <span className="text-muted-foreground text-xs">
              Opt to use 24-hours to input times. This will not affect your
              users, just allows you to input times as opposed to dealing with
              an AM/PM toggle.
              <br />
              <br />
              Times will automatically be formatted when you finish typing, for
              example, when {'"'}93:6 {'"'} is displayed, it will format to
              {'"'}09:36{'"'}.
            </span>
          </label>
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            <div className="flex items-center justify-between gap-2">
              Observe Daylight Saving Time
              <Switch checked={observeDST} onCheckedChange={setObserveDST} />
            </div>
            <span className="text-muted-foreground text-xs">
              Opt to use 24-hours to input times. This will not affect your
              users, just allows you to input times as opposed to dealing with
              an AM/PM toggle.
              <br />
              <br />
              Times will automatically be formatted when you finish typing, for
              example, when {'"'}93:6 {'"'} is displayed, it will format to
              {'"'}09:36{'"'}.
            </span>
          </label>
        </div>
        <div className="mt-2 mb-3 flex items-center justify-between gap-2">
          <Button variant="outline" href={`/app/schools/${schoolId}/manage`}>
            <ArrowLeft />
            Back
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              await fetch("/api/catalyst/schools/schedules/set", {
                method: "POST",
                body: JSON.stringify({
                  schoolId: schoolId,
                  options: {
                    observeDST: observeDST,
                  },
                  schedules,
                }),
              });
              setSaving(false);
            }}
            disabled={saving || !schedules.length}
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
      <div className="flex flex-1 flex-col gap-2">
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <WrapText /> Period Summary
        </h2>
        <ClassPeriodCreator
          schoolId={schoolId}
          periods={periods}
          schedules={schedules}
          use24HourMode={use24HourMode}
          setSchedules={setSchedules}
          tzOffset={tzOffset}
        />
        <div className="mt-4 flex items-center justify-between">
          <Button
            onClick={() =>
              setSchedules((prev) => [
                ...prev,
                {
                  periods: [],
                  schoolId: schoolId,
                  id: crypto.randomUUID(),
                  name: `Schedule ${prev.length + 1}`,
                },
              ])
            }
            className="w-full"
          >
            <Plus /> Add Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}
function ClassPeriodCreator({
  periods,
  schoolId,
  use24HourMode,
  schedules,
  setSchedules,
  tzOffset,
}: Options & {
  use24HourMode: boolean;
  setSchedules: Dispatch<SetStateAction<Options["schedules"]>>;
  tzOffset: number;
}) {
  return (
    <Accordion type="multiple">
      {schedules.map((schedule) => (
        <AccordionItem value={schedule.id} key={schedule.id}>
          <AccordionTrigger>{schedule.name}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2" forceMount>
            <div className="flex items-center gap-2">
              <Input
                value={schedule.name}
                onChange={(evt) =>
                  setSchedules((prev) =>
                    prev.map((s) =>
                      s.id == schedule.id
                        ? { ...s, name: evt.target.value }
                        : s,
                    ),
                  )
                }
              />
              <Button
                variant="destructive"
                className="shrink-0"
                size="icon"
                onClick={() =>
                  setSchedules((prev) =>
                    prev.filter((s) => s.id != schedule.id),
                  )
                }
              >
                <Trash />
              </Button>
            </div>
            <Reorder.Group
              axis="y"
              values={schedule.periods}
              onReorder={(newOrder) =>
                setSchedules((prev) =>
                  prev.map((s) =>
                    s.id == schedule.id ? { ...s, periods: newOrder } : s,
                  ),
                )
              }
            >
              {schedule?.periods?.map((period, idx) => (
                <PeriodItem
                  key={`${schedule.id}-${period.id}`}
                  periods={periods}
                  schoolId={schoolId}
                  use24HourMode={use24HourMode}
                  schedules={schedules}
                  setSchedules={setSchedules}
                  setPeriods={(periods) =>
                    setSchedules((prev) =>
                      prev.map((s) =>
                        s.id == schedule.id
                          ? {
                              ...s,
                              periods:
                                typeof periods != "function"
                                  ? periods
                                  : periods(schedule.periods),
                            }
                          : s,
                      ),
                    )
                  }
                  setPeriod={(period) => {
                    setSchedules((prev) =>
                      prev.map((s) =>
                        s.id == schedule.id
                          ? {
                              ...s,
                              periods: s.periods.map((p) =>
                                p.id == period.id ? period : p,
                              ),
                            }
                          : s,
                      ),
                    );
                  }}
                  period={period}
                  schedule={schedule}
                  idx={idx}
                  tzOffset={tzOffset}
                />
              ))}
              <Combobox
                className="mt-4 w-full flex-1"
                placeholders={{
                  emptyValue: "Add a period...",
                }}
                onSelect={(value) => {
                  setSchedules((prev) =>
                    prev.map((s) =>
                      s.id == schedule.id
                        ? {
                            ...s,
                            periods: [
                              ...s.periods,
                              {
                                id: crypto.randomUUID(),
                                schoolId: s.schoolId ?? "",
                                optionId: value,
                                order: s.periods.length,
                                scheduleId: s.id,
                                start: "",
                                end: "",
                                period: {
                                  ...periods.find((p) => p.optionId == value)!,
                                  scheduleId: s.id,
                                  order: s.periods.length,
                                  start: "",
                                  end: "",
                                },
                              },
                            ],
                          }
                        : s,
                    ),
                  );
                }}
                value={""}
                groups={[
                  {
                    id: "new-item-group",
                    header: "",
                    values: [
                      ...(() => {
                        if (!periods) return [];
                        return periods.flatMap((period) =>
                          period?.options
                            ? period.options.map((option) => ({
                                id: option.optionId,
                                render: `${option.optionName} — ${option.periodName}`,
                              }))
                            : [
                                {
                                  id: period.optionId,
                                  render: period.periodName,
                                },
                              ],
                        );
                      })(),
                    ],
                  },
                ]}
              />
            </Reorder.Group>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function PeriodItem({
  periods,
  use24HourMode,
  setPeriod,
  setPeriods,
  period,
  tzOffset,
}: Options & {
  use24HourMode: boolean;
  setSchedules: Dispatch<SetStateAction<Options["schedules"]>>;
  setPeriods: Dispatch<SetStateAction<Options["schedules"][number]["periods"]>>;
  setPeriod: (value: Options["schedules"][number]["periods"][number]) => void;
  period: Options["schedules"][number]["periods"][number];
  schedule: Options["schedules"][number];
  idx: number;
  tzOffset: number;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={period}
      className="bg-background @container flex flex-col items-center gap-2 rounded-md p-2"
      dragListener={false}
      dragControls={controls}
    >
      <div className="flex w-full items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab"
        >
          <GripVertical />
        </Button>
        <Combobox
          className="w-full flex-1"
          onSelect={(value) => {
            setPeriod({ ...period, optionId: value });
          }}
          value={period.optionId}
          groups={[
            {
              id: period.id,
              header: "",
              values: [
                ...(() => {
                  if (!periods) return [];
                  return periods.flatMap((period) =>
                    period?.options
                      ? period.options.map((option) => ({
                          id: option.optionId,
                          render: `${option.optionName} — ${option.periodName}`,
                        }))
                      : [
                          {
                            id: period.optionId,
                            render: period.periodName,
                          },
                        ],
                  );
                })(),
              ],
            },
          ]}
        />
        <Button
          variant="destructive"
          className="shrink-0"
          size="icon"
          onClick={() => {
            setPeriods((prev) => prev.filter((p) => p.id != period.id));
          }}
        >
          <Trash />
        </Button>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2 @lg:flex-row">
        <TimeInput
          value={applyTzOffset(period.start.replace(":", ""), tzOffset)}
          setValue={(val) =>
            setPeriod({
              ...period,
              start: removeTzOffset(val, tzOffset),
            })
          }
          use24HourMode={use24HourMode}
        />
        <span>
          <Minus />
        </span>
        <TimeInput
          value={applyTzOffset(period.end.replace(":", ""), tzOffset)}
          setValue={(val) =>
            setPeriod({
              ...period,
              end: removeTzOffset(val, tzOffset),
            })
          }
          use24HourMode={use24HourMode}
        />
      </div>
    </Reorder.Item>
  );
}

function applyTzOffset(time: string, offset: number): string {
  if (!time || time.length < 4) return time.padStart(4, "0");
  const hours = parseInt(time.slice(0, 2), 10);
  const minutes = parseInt(time.slice(2, 4), 10);
  const date = new Date();
  date.setHours(hours + offset, minutes, 0, 0);
  return date.toTimeString().slice(0, 5).replace(":", "");
}

function removeTzOffset(time: string, offset: number): string {
  if (!time || time.length < 4) return time.padStart(4, "0");
  const hours = Number(time.slice(0, 2));
  const minutes = Number(time.slice(2, 4));
  const date = new Date();
  date.setHours(hours - offset, minutes, 0, 0);
  return date.toTimeString().slice(0, 5);
}

function TimeInput({
  value,
  setValue,
  use24HourMode,
}: {
  value: string;
  setValue: (value: string) => void;
  use24HourMode: boolean;
}) {
  const [valueInternal, setValueInternal] = useState("");
  const [isPm, setIsPm] = useState(false);

  useEffect(() => {
    if (!use24HourMode && Number(value) >= 1200) {
      setIsPm(true);
    } else {
      setIsPm(false);
    }
  }, [use24HourMode, value]);

  useEffect(() => {
    setValueInternal(
      value == ""
        ? ""
        : String(
            ((Number(value) - 100) % (use24HourMode ? 2400 : 1200)) + 100,
          ).padStart(4, "0"),
    );
  }, [use24HourMode, value]);

  return (
    <div className="flex items-center gap-2">
      <InputOTP
        value={valueInternal}
        onChange={(newValue) => setValueInternal(newValue)}
        onBlur={() => {
          setValue(
            valueInternal.trim() == "" ? "" : valueInternal.padStart(4, "0"),
          );
        }}
        onKeyDown={(evt) => {
          if (evt.key === "Enter") {
            setValue(
              valueInternal.trim() == "" ? "" : valueInternal.padStart(4, "0"),
            );
          } else if (evt.key === "Escape") {
            setValueInternal(
              String(((Number(value) - 100) % 1200) + 100).padStart(4, "0"),
            );
          }
        }}
        maxLength={4}
      >
        <InputOTPGroup>
          {[0, 1].map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
        <span>:</span>
        <InputOTPGroup>
          {[2, 3].map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {!use24HourMode && (
        <Select
          value={isPm ? "pm" : "am"}
          onValueChange={(value) => setIsPm(value === "pm")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select AM/PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="am">AM</SelectItem>
            <SelectItem value="pm">PM</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
