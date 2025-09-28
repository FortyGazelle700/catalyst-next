"use client";

import { LocaleTimeString } from "@/components/util/format-date-client";
import { cn } from "@/lib/utils";

type Period = {
  period: {
    id: string;
    periodName: string;
    optionName: string;
  };
  time: {
    start: string;
    end: string;
  };
};

interface ScheduleTableClientProps {
  periods: Period[];
  now: Date;
}

export function ScheduleTableClient({
  periods,
  now,
}: ScheduleTableClientProps) {
  // Find the current period (the one where now is between start and end)
  const currentPeriodId = periods.find((period) => {
    const start = new Date(
      `${now.toISOString().split("T")[0]}T${period.time.start}Z`,
    ).getTime();
    const end = new Date(
      `${now.toISOString().split("T")[0]}T${period.time.end}Z`,
    ).getTime();
    return now.getTime() >= start && now.getTime() < end;
  })?.period.id;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Start</th>
          <th>End</th>
        </tr>
      </thead>
      <tbody>
        {periods.map((period) => {
          const isCurrent = period.period.id === currentPeriodId;
          return (
            <tr
              key={period.period.id}
              className={cn(isCurrent && "bg-primary")}
            >
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
                      `${now.toISOString().split("T")[0]}T${period?.time.start}Z`,
                    )
                  }
                  options={{ timeStyle: "short" }}
                />
              </td>
              <td>
                <LocaleTimeString
                  date={
                    new Date(
                      `${now.toISOString().split("T")[0]}T${period?.time.end}Z`,
                    )
                  }
                  options={{ timeStyle: "short" }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
