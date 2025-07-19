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
}: {
  courses: Course[];
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
  const [values, setValues] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);

  return (
    <>
      <div className="flex flex-col w-full -mb-4">
        {periods?.map(
          (period, index) =>
            period && (
              <div
                key={period.id}
                className={cn(
                  "flex sm:flex-row flex-col w-full items-center gap-2 p-4",
                  index != 0 && "border-t"
                )}
              >
                <h2 className="text-left font-bold w-full sm:w-auto pl-4 sm:pl-0">
                  {period.name}
                </h2>
                {(() => {
                  switch (period.type) {
                    case "filler":
                      return (
                        <span className="sm:ml-auto w-full sm:max-w-[20rem] flex-1 text-muted-foreground bg-input/30 px-4 py-2 rounded-full border border-input text-sm">
                          No Selectable Options
                        </span>
                      );
                    case "single":
                      return (
                        <Combobox
                          className="sm:ml-auto w-full sm:max-w-[20rem] flex-1"
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
                              values: period.options!.map((value) => ({
                                id: value.id,
                                render: value.name,
                              })),
                            },
                          ]}
                        />
                      );
                    case "course":
                      return (
                        <Combobox
                          className="sm:ml-auto w-full sm:max-w-[20rem] flex-1"
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
                              values:
                                courses.map((course) => ({
                                  id: String(course.id),
                                  render: (
                                    <div className="flex flex-col gap-2 overflow-hidden">
                                      <span className="font-bold">
                                        {course.classification ??
                                          "No Classification"}
                                      </span>
                                      <span className="truncate text-xs text-muted-foreground">
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
                                })) ?? [],
                            },
                          ]}
                        />
                      );
                  }
                })()}
              </div>
            )
        )}
      </div>
      <div className="flex justify-between items-end sm:items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={async () => {
            router.push(
              `/app/onboarding/canvas?${new URLSearchParams(
                window.location.search
              ).toString()}`
            );
          }}
        >
          <ArrowLeft /> Back
        </Button>
        <div className="flex sm:flex-row flex-col items-end sm:items-center gap-4">
          <span className="text-xs text-muted-foreground">
            You can change these settings anytime
          </span>
          <Button
            onClick={async () => {
              setSaving(true);
              await fetch("/api/catalyst/settings/set-periods", {
                method: "POST",
                body: JSON.stringify({
                  periods: {
                    ...periods.reduce((acc, period) => {
                      acc[period.id] = values[period.id] ?? "";
                      return acc;
                    }, {} as Record<string, string>),
                  },
                }),
              });
              router.push(
                new URLSearchParams(window.location.search).get("redirectTo") ??
                  "/app"
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
