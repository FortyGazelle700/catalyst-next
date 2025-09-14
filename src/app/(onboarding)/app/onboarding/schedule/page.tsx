import { api } from "@/server/api";
import ScheduleClientPage from "./page.client";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding / Schedule Information",
  description: "Provide a schedule for your courses",
};

export default async function SchedulePage() {
  const { data: courses } = await (
    await api({})
  ).canvas.courses.list({
    limit: 100,
    offset: 1,
    enrollmentState: "active",
  });

  const { data: periods } = await (
    await api({})
  ).catalyst.schools.periods.list({});

  const { data: periodData } = await (
    await api({})
  ).catalyst.account.settings.listPeriods();

  const defaultValues: Record<string, string> = {};
  for (const item of periodData) {
    defaultValues[item.periodId] = item.value;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col">
        <div className="bg-border my-4 h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary vt-name-[nav-slider] h-full rounded-full transition-all duration-500"
            style={{ width: "100%" }}
          />
        </div>
        <div className="text-muted-foreground -mt-2 flex justify-between rounded-full text-xs">
          <span>Schedule Information</span>
          <span>Step 3 / 3</span>
        </div>
      </div>
      <h2 className="h3">Scheduling Information</h2>
      <p className="text-foreground/70 text-sm">
        Please enter your schedule information. Courses are pulled from your
        Canvas course list—if a course doesn{"'"}t have a Canvas tile, it won
        {"'"}t appear here.
        <br />
        <br />
        You don{"'"}t need to fill every period, but completing more slots
        improves your experience. Enter your schedule as accurately as possible
        (you can always update it later or skip this step for now).
      </p>
      <h2 className="h3">Your Schedule Details</h2>
      <ScheduleClientPage
        courses={courses ?? []}
        periods={periods ?? []}
        defaultValues={defaultValues}
      />
    </div>
  );
}
