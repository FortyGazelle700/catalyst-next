"use client";

import {
  ResponsivePopover,
  ResponsivePopoverTrigger,
  ResponsivePopoverContent,
  ResponsivePopoverTitle,
} from "@/components/catalyst/responsible-popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Notebook,
  Plus,
  RotateCcw,
  Trash,
  WrapText,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface Period {
  id: string;
  name: string;
  type: "course" | "single" | "filler";
  options: {
    id: string;
    name: string;
  }[];
}

export default function PeriodsPageClient() {
  const router = useRouter();

  const [standardPeriods, setStandardPeriods] = useState<Period[]>([]);
  const [customPeriods, setCustomPeriods] = useState<Period[]>([]);
  const [lunchPeriod, setLunchPeriod] = useState<Period[]>([]);
  const [specialPeriods, setSpecialPeriods] = useState<Period[]>([]);
  const [otherPeriods, setOtherPeriods] = useState<Period[]>([]);

  const [saving, setSaving] = useState(false);

  const periods = useMemo(
    () => [
      ...standardPeriods.map((p) => ({
        ...p,
        update: (period: Period) => {
          setStandardPeriods((prev) =>
            prev.map((p) => (p.id == period.id ? period : p)),
          );
        },
        delete: (period: Period) => {
          setStandardPeriods((prev) => prev.filter((p) => p.id != period.id));
        },
      })),
      ...customPeriods.map((p) => ({
        ...p,
        update: (period: Period) => {
          setCustomPeriods((prev) =>
            prev.map((p) => (p.id == period.id ? period : p)),
          );
        },
        delete: (period: Period) => {
          setCustomPeriods((prev) => prev.filter((p) => p.id != period.id));
        },
      })),
      ...lunchPeriod.map((p) => ({
        ...p,
        update: (period: Period) => {
          setLunchPeriod((prev) =>
            prev.map((p) => (p.id == period.id ? period : p)),
          );
        },
        delete: (period: Period) => {
          setLunchPeriod((prev) => prev.filter((p) => p.id != period.id));
        },
      })),
      ...specialPeriods.map((p) => ({
        ...p,
        update: (period: Period) => {
          setSpecialPeriods((prev) =>
            prev.map((p) => (p.id == period.id ? period : p)),
          );
        },
        delete: (period: Period) => {
          setSpecialPeriods((prev) => prev.filter((p) => p.id != period.id));
        },
      })),
      ...otherPeriods.map((p) => ({
        ...p,
        update: (period: Period) => {
          setOtherPeriods((prev) =>
            prev.map((p) => (p.id == period.id ? period : p)),
          );
        },
        delete: (period: Period) => {
          setOtherPeriods((prev) => prev.filter((p) => p.id != period.id));
        },
      })),
    ],
    [standardPeriods, customPeriods, lunchPeriod, specialPeriods, otherPeriods],
  );

  useState(() => {
    const saved = localStorage.getItem("onboardingPeriods");
    if (saved) {
      try {
        const data = JSON.parse(saved) as {
          standardPeriods?: Period[];
          customPeriods?: Period[];
          lunchPeriod?: Period[];
          specialPeriods?: Period[];
          otherPeriods?: Period[];
        };
        setStandardPeriods(data.standardPeriods ?? []);
        setCustomPeriods(data.customPeriods ?? []);
        setLunchPeriod(data.lunchPeriod ?? []);
        setSpecialPeriods(data.specialPeriods ?? []);
        setOtherPeriods(data.otherPeriods ?? []);
      } catch {
        console.error("Failed to parse onboarding periods from localStorage");
      }
    }
  });

  useMemo(() => {
    localStorage.setItem(
      "onboardingPeriods",
      JSON.stringify({
        standardPeriods,
        customPeriods,
        lunchPeriod,
        specialPeriods,
        otherPeriods,
      }),
    );
  }, [
    standardPeriods,
    customPeriods,
    lunchPeriod,
    specialPeriods,
    otherPeriods,
  ]);

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h2 className="mt-2 flex items-center gap-2 font-bold">
            <Clock /> Periods
          </h2>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            Standard Periods
            <Input
              value={standardPeriods.length}
              type="number"
              min={0}
              max={20}
              onChange={(evt) => {
                const value = Math.min(
                  Math.max(Number(evt.target.value), 0),
                  20,
                );
                let length = standardPeriods.length;
                if (value > length) {
                  while (length < value) {
                    length++;
                    setStandardPeriods((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        name: `Period ${length}`,
                        type: "course" as const,
                        options: [],
                      },
                    ]);
                  }
                } else if (value < length) {
                  while (length > value) {
                    length--;
                    setStandardPeriods((prev) => prev.slice(0, -1));
                  }
                }
              }}
              placeholder="7"
              className="text-foreground"
            />
            <span className="text-muted-foreground text-xs">
              These are general periods shared by all students at your school,
              no matter their classes or schedules. Each period will
              automatically have a course type assigned, like Period 1, Period
              2, etc. It doesn{"'"}t matter which subject falls into which
              period—these are just placeholders used for all students.
            </span>
          </label>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            Custom Periods
            <Input
              value={customPeriods.length}
              type="number"
              min={0}
              max={20}
              onChange={(evt) => {
                const value = Math.min(
                  Math.max(Number(evt.target.value), 0),
                  20,
                );
                let length = customPeriods.length;
                if (value > length) {
                  while (length < value) {
                    length++;
                    setCustomPeriods((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        name: `Custom Period ${length}`,
                        type: "course" as const,
                        options: [],
                      },
                    ]);
                  }
                } else if (value < length) {
                  while (length > value) {
                    length--;
                    setCustomPeriods((prev) => prev.slice(0, -1));
                  }
                }
              }}
              placeholder="2"
              className="text-foreground"
            />
            <span className="text-muted-foreground text-xs">
              Like standard periods, these are course periods, however, meant to
              be more flexible, for example, custom class names that every
              student will have, like {'"'}Advisory{'"'} or {'"'}Study Hall{'"'}
              . This name is visible to all students, so it should be something
              that makes sense to everyone.
            </span>
          </label>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            Break Periods / Lunch
            <Input
              value={lunchPeriod.length}
              type="number"
              min={0}
              max={20}
              onChange={(evt) => {
                const value = Math.min(
                  Math.max(Number(evt.target.value), 0),
                  20,
                );
                let length = lunchPeriod.length;
                if (value > length) {
                  while (length < value) {
                    length++;
                    setLunchPeriod((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        name: `Break Period ${length}`,
                        type: "filler" as const,
                        options: [],
                      },
                    ]);
                  }
                } else if (value < length) {
                  while (length > value) {
                    length--;
                    setLunchPeriod((prev) => prev.slice(0, -1));
                  }
                }
              }}
              placeholder="1"
              className="text-foreground"
            />
            <span className="text-muted-foreground text-xs">
              These periods are for breaks, such as lunch or time between
              classes. Most schools only need one lunch period. However, if your
              schedule changes by day (e.g., odd/even days) and lunch happens at
              different times, you may need separate lunch periods—one for each
              day. For example, if you have 1st of 3 lunches on odd days and 2nd
              of 3 on even days, you{"'"}d create two lunch periods. If lunch is
              always at the same time for all students, regardless of the day,
              one lunch period is enough. For schools with blocked lunches—where
              different groups have lunch at different times on the same day—you
              can set the period type to {'"'}single select{'"'} and add options
              like
              {'"'}1st Lunch,{'"'} {'"'}2nd Lunch,{'"'} etc.
            </span>
          </label>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            Include Assembly?
            <span className="flex items-center gap-2">
              <Checkbox
                checked={specialPeriods.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSpecialPeriods((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        name: `Assembly`,
                        type: "filler" as const,
                        options: [],
                      },
                    ]);
                  } else {
                    setSpecialPeriods([]);
                  }
                }}
              />{" "}
              Include
            </span>
            <span className="text-muted-foreground text-xs">
              If your school occasionally holds assemblies, you can enable this
              option. It will create a special period that simply shows when
              assemblies occur, without affecting schedules or classes.
            </span>
          </label>
        </div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <Notebook className="size-4" /> Notes
        </h2>
        <span className="text-muted-foreground text-xs">
          Course select allows students to select specific courses for each
          period.
          <br />
          Single select allows students to choose from a list of options for
          that period.
          <br />
          None means that period is not used for any specific course or
          selection. This is useful for breaks, lunch, or assemblies.
          <br />
          <br />
          If you need to add more periods later, you can do so in the settings.
          <br />
          <br />
          After Onboarding, you will be able to create schedules and assign
          times to these periods.
        </span>
        <div className="mt-2 mb-3 flex items-center justify-between gap-2">
          <ResponsivePopover>
            <ResponsivePopoverTrigger asChild>
              <Button variant="outline">
                <ArrowLeft />
                Back
              </Button>
            </ResponsivePopoverTrigger>
            <ResponsivePopoverContent className="@container w-84 md:w-52">
              <ResponsivePopoverTitle className="mb-4 text-center">
                Are you sure you want to cancel?
              </ResponsivePopoverTitle>
              <div className="mx-auto flex flex-col gap-2">
                <Button
                  variant="secondary"
                  className="justify-start"
                  onClick={() => {
                    router.push(
                      `/app/onboarding/school?${new URLSearchParams(
                        window.location.search,
                      ).toString()}`,
                    );
                  }}
                >
                  <ArrowLeft /> Back
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    localStorage.removeItem("onboardingPeriods");
                  }}
                >
                  <RotateCcw /> Reset
                </Button>
                <Button
                  variant="destructive"
                  className="justify-start"
                  onClick={async () => {
                    await fetch("/api/catalyst/schools/delete", {
                      method: "DELETE",
                    });
                    localStorage.removeItem("schoolData");
                    localStorage.removeItem("onboardingPeriods");
                    router.push(
                      `/app/onboarding?${new URLSearchParams(
                        window.location.search,
                      ).toString()}`,
                    );
                  }}
                >
                  <Trash /> Delete School
                </Button>
              </div>
            </ResponsivePopoverContent>
          </ResponsivePopover>
          <Button
            onClick={async () => {
              setSaving(true);
              await fetch("/api/catalyst/schools/periods/set", {
                method: "POST",
                body: JSON.stringify({
                  periods: periods.map((p, pi) => ({
                    id: p.id,
                    order: pi,
                    name: p.name,
                    type: p.type,
                    options:
                      p.options.length == 0
                        ? undefined
                        : p.options.map((o, oi) => ({
                            id: o.id,
                            name: o.name,
                            order: oi,
                          })),
                  })),
                }),
              });
              router.push(
                `/app/onboarding?${new URLSearchParams(
                  window.location.search,
                ).toString()}`,
              );
            }}
            disabled={saving || !periods.length}
          >
            {saving ? (
              <>
                Saving... <Loader className="animate-spin" />
              </>
            ) : (
              <>
                Save and Continue
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <WrapText /> Period Summary
        </h2>
        {periods.map((p, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 px-2 py-1"
          >
            <Input
              value={p.name}
              onChange={(evt) => p.update({ ...p, name: evt.target.value })}
              placeholder="Period Name"
              className="text-foreground"
            />
            <div className="flex w-full items-center gap-2">
              <Select
                value={p.type}
                onValueChange={(value) => {
                  p.update({ ...p, type: value as Period["type"] });
                  if (value != "single") {
                    setTimeout(() => {
                      p.update({
                        ...p,
                        options: [],
                      });
                    }, 10);
                  }
                }}
              >
                <SelectTrigger className="text-muted-foreground !h-auto w-full border-hidden !bg-transparent p-0 !pl-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="single">Single Select</SelectItem>
                  <SelectItem value="filler">None</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="text-destructive-foreground h-auto bg-transparent p-0 underline-offset-2 hover:bg-transparent hover:underline"
                onClick={() => p.delete(p)}
              >
                <Trash /> Delete
              </Button>
            </div>
            <div className="ml-4 flex w-[calc(100%-theme(spacing.4))] flex-col items-stretch gap-2 border-l pl-4">
              {p.type === "single" && (
                <>
                  {p.options.map((opt) => (
                    <div className="flex items-center gap-2" key={opt.id}>
                      <Input
                        value={opt.name}
                        onChange={(evt) =>
                          p.update({
                            ...p,
                            options: p.options.map((o) =>
                              o.id === opt.id
                                ? { ...o, name: evt.target.value }
                                : o,
                            ),
                          })
                        }
                        placeholder="Option"
                        className="text-foreground flex-1"
                      />
                      <Button
                        variant="destructive"
                        onClick={() =>
                          p.update({
                            ...p,
                            options: p.options.filter((o) => o.id !== opt.id),
                          })
                        }
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() =>
                      p.update({
                        ...p,
                        options: [
                          ...p.options,
                          {
                            id: crypto.randomUUID(),
                            name: `Option ${p.options.length + 1}`,
                          },
                        ],
                      })
                    }
                    className="mt-2 justify-start"
                    variant="secondary"
                  >
                    <Plus /> Add Option
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="mt-4 flex items-center justify-between">
          <Button
            onClick={() =>
              setOtherPeriods((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  name: `Other Period ${prev.length + 1}`,
                  type: "filler" as const,
                  options: [],
                },
              ])
            }
            className="w-full"
          >
            <Plus /> Add Other Period
          </Button>
        </div>
      </div>
    </div>
  );
}
