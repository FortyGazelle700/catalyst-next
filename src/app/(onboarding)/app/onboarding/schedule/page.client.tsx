"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Course } from "@/server/api/canvas/types";
import { ArrowRight } from "lucide-react";
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
          draftState: "draft" | "saved" | null;
          schoolId: string;
          periodId: string;
          optionId: string;
          periodName: string;
          optionName: string;
          periodOrder: number | null;
          optionOrder: number | null;
        }[]
      | undefined;
    draftState: "draft" | "saved" | null;
    schoolId: string;
    periodId: string;
    optionId: string;
    periodName: string;
    optionName: string;
  }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <>
      {periods?.map(
        (period) =>
          period && (
            <div
              key={period.id}
              className="flex w-full items-center gap-2 rounded-md border p-4"
            >
              <h2 className="text-lg font-bold">{period.name}</h2>
              {(() => {
                switch (period.type) {
                  case "filler":
                    return (
                      <span className="ml-auto text-xs text-muted-foreground">
                        No Selectable Options
                      </span>
                    );
                  case "single":
                    return (
                      <Combobox
                        className="ml-auto max-w-[20rem] flex-1"
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
                        className="ml-auto max-w-[20rem] flex-1"
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
      <Button
        onClick={async () => {
          await fetch("/api/catalyst/settings/set-periods", {
            method: "POST",
            body: JSON.stringify({
              periods: {
                ...periods.reduce((acc, period) => {
                  acc[period.id] = values[period.id];
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
      >
        Save and Continue
        <ArrowRight />
      </Button>
    </>
  );
}
