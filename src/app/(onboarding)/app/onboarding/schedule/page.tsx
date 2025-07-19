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
      <ScheduleClientPage courses={courses ?? []} periods={periods ?? []} />
    </div>
  );
}
