"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { type Course } from "@/server/api/canvas/types";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ScheduleClientPage({
  courses,
  periods,
  defaultValues,
}: {
  courses: Course[];
  defaultValues: Record<string, string>;
  periods: {
    id: string;
    name: string;
    type: "single" | "course" | "filler";
    periodOrder: number;
    optionOrder: number;
    options:
      | {
          id: string;
          name: string;
          type: "single" | "course" | "filler" | null;
          schoolId: string;
          periodId: string;
          optionId: string;
          periodName: string;
          optionName: string;
          periodOrder: number | null;
          optionOrder: number | null;
        }[]
      | undefined;
    schoolId: string;
    periodId: string;
    optionId: string;
    periodName: string;
    optionName: string;
  }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(defaultValues);

  const [saving, setSaving] = useState(false);

  return (
    <>
      <div className="-mb-4 flex w-full flex-col">
        {periods?.map(
          (period, index) =>
            period && (
              <div
                key={period.id}
                className={cn(
                  "flex w-full flex-col items-center gap-2 p-4 sm:flex-row",
                  index != 0 && "border-t",
                )}
              >
                <h2 className="w-full pl-4 text-left font-bold sm:w-auto sm:pl-0">
                  {period.name}
                </h2>
                {(() => {
                  switch (period.type) {
                    case "filler":
                      return (
                        <span className="text-muted-foreground bg-input/30 border-input w-full flex-1 rounded-full border px-4 py-2 text-sm sm:ml-auto sm:max-w-[20rem]">
                          No Selectable Options
                        </span>
                      );
                    case "single":
                      return (
                        <Combobox
                          className="w-full flex-1 sm:ml-auto sm:max-w-[20rem]"
                          onSelect={(valueId) => {
                            setValues((prev) => ({
                              ...prev,
                              [period.id]: valueId,
                            }));
                          }}
                          defaultValue={values[period.id]}
                          groups={[
                            {
                              id: period.id,
                              header: "",
                              values: [
                                { id: "", render: "Empty" },
                                ...period.options!.map((value) => ({
                                  id: value.id,
                                  render: value.name,
                                })),
                              ],
                            },
                          ]}
                        />
                      );
                    case "course":
                      return (
                        <Combobox
                          className="w-full flex-1 sm:ml-auto sm:max-w-[20rem]"
                          placeholders={{
                            emptyValue: "Select a course",
                            search: "Search for a course",
                          }}
                          onSelect={(courseId) => {
                            setValues((prev) => ({
                              ...prev,
                              [period.id]: courseId,
                            }));
                          }}
                          defaultValue={values[period.id]}
                          groups={[
                            {
                              id: period.id,
                              header: "",
                              values: [
                                {
                                  id: "",
                                  render: (
                                    <div className="flex flex-col gap-2 overflow-hidden">
                                      <span className="font-bold">Blank</span>
                                      <span className="text-muted-foreground truncate text-xs">
                                        Empty
                                      </span>
                                    </div>
                                  ),
                                  selectionRender: (
                                    <div className="flex flex-col gap-2 truncate">
                                      Filler
                                    </div>
                                  ),
                                },
                                ...(courses.map((course) => ({
                                  id: String(course.id),
                                  render: (
                                    <div className="flex flex-col gap-2 overflow-hidden">
                                      <span className="font-bold">
                                        {course.classification ??
                                          "No Classification"}
                                      </span>
                                      <span className="text-muted-foreground truncate text-xs">
                                        {course.original_name}
                                      </span>
                                    </div>
                                  ),
                                  selectionRender: (
                                    <div className="flex flex-col gap-2 truncate">
                                      {course.classification ??
                                        "No Classification"}{" "}
                                      ({course.original_name})
                                    </div>
                                  ),
                                })) ?? []),
                              ],
                            },
                          ]}
                        />
                      );
                  }
                })()}
              </div>
            ),
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 sm:items-center">
        <Button
          variant="outline"
          onClick={async () => {
            router.push(
              `/app/onboarding/canvas?${new URLSearchParams(
                window.location.search,
              ).toString()}`,
            );
          }}
        >
          <ArrowLeft /> Back
        </Button>
        <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center">
          <span className="text-muted-foreground text-xs">
            You can change these settings anytime
          </span>
          <Button
            onClick={async () => {
              setSaving(true);
              await fetch("/api/catalyst/account/settings/set-periods", {
                method: "POST",
                body: JSON.stringify({
                  periods: {
                    ...periods.reduce(
                      (acc, period) => {
                        acc[period.id] = values[period.id] ?? "";
                        return acc;
                      },
                      {} as Record<string, string>,
                    ),
                  },
                }),
              });
              router.push(
                new URLSearchParams(window.location.search).get("redirectTo") ??
                  "/app",
              );
            }}
            disabled={saving}
          >
            {saving ? (
              <>
                Saving... <Loader className="animate-spin" />
              </>
            ) : (
              <>
                {Object.values(values).every((value) => value == "") ? (
                  <>
                    Skip
                    <ArrowRight />
                  </>
                ) : (
                  <>
                    Save and Continue
                    <ArrowRight />
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
