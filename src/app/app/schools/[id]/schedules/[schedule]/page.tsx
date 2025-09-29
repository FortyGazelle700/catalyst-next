import { Button } from "@/components/ui/button";
import { LocaleTimeString } from "@/components/util/format-date-client";
import { api } from "@/server/api";
import { ArrowLeft } from "lucide-react";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string; schedule: string }>;
}) {
  const resolvedParams = await params;

  const { data: scheduleList } = await (
    await api({})
  ).catalyst.schools.schedules.list({ id: resolvedParams.id });

  const { data: schedule } = await (
    await api({})
  ).catalyst.schools.schedules.details({
    schoolId: resolvedParams.id,
    scheduleId: resolvedParams.schedule,
  });

  const now = new Date();

  return (
    <div className="@container mx-auto flex w-full max-w-[120ch] flex-col gap-6 px-12 py-8">
      <Button
        variant="outline"
        href={`/app/schools/${resolvedParams.id}`}
        className="mr-auto"
      >
        <ArrowLeft /> Back to Overview
      </Button>
      <h1 className="h1 -mt-2">
        {scheduleList.find((s) => s.id == resolvedParams.schedule)?.name}{" "}
        Schedule
      </h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {schedule
            .sort(
              (a, b) =>
                new Date(
                  `${now.toISOString().split("T")[0]}T${a.start}Z`,
                ).getTime() -
                  new Date(
                    `${now.toISOString().split("T")[0]}T${b.start}Z`,
                  ).getTime() ||
                new Date(
                  `${now.toISOString().split("T")[0]}T${b.end}Z`,
                ).getTime() -
                  new Date(
                    `${now.toISOString().split("T")[0]}T${a.end}Z`,
                  ).getTime(),
            )
            .map((period) => (
              <tr key={period.id}>
                <td>
                  {period.period.periodName}
                  {period.period.periodName != period.period.optionName
                    ? ` (${period.period.optionName})`
                    : ""}
                </td>
                <td>
                  <LocaleTimeString
                    date={
                      new Date(
                        `${now.toISOString().split("T")[0]}T${period?.start}Z`,
                      )
                    }
                    options={{ timeStyle: "short" }}
                  />
                </td>
                <td>
                  <LocaleTimeString
                    date={
                      new Date(
                        `${now.toISOString().split("T")[0]}T${period?.end}Z`,
                      )
                    }
                    options={{ timeStyle: "short" }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
