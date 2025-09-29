import { Button } from "@/components/ui/button";
import { api } from "@/server/api";
import { ArrowLeft } from "lucide-react";
import { ScheduleTableClient } from "./page.client";

export default async function SchedulePage() {
  const { data: scheduleList } = await (
    await api({})
  ).canvas.courses.getWithSchedule();

  const now = new Date();

  if (!scheduleList) {
    return (
      <div className="@container mx-auto flex w-full max-w-[120ch] flex-col gap-6 px-12 py-8">
        <Button variant="outline" href="/app/schedule/now" className="mr-auto">
          <ArrowLeft /> Back to Now
        </Button>
        <h1 className="h1 -mt-2">Current Schedule</h1>
        <p>No schedule data available.</p>
      </div>
    );
  }

  // Sort periods as before
  const sortedPeriods = scheduleList.periods
    .slice()
    .sort(
      (a, b) =>
        new Date(
          `${now.toISOString().split("T")[0]}T${a.time.start}Z`,
        ).getTime() -
          new Date(
            `${now.toISOString().split("T")[0]}T${b.time.start}Z`,
          ).getTime() ||
        new Date(
          `${now.toISOString().split("T")[0]}T${b.time.end}Z`,
        ).getTime() -
          new Date(
            `${now.toISOString().split("T")[0]}T${a.time.end}Z`,
          ).getTime(),
    );

  return (
    <div className="@container mx-auto flex w-full max-w-[120ch] flex-col gap-6 px-12 py-8">
      <Button variant="outline" href="/app/schedule/now" className="mr-auto">
        <ArrowLeft /> Back to Now
      </Button>
      <h1 className="h1 -mt-2">Current Schedule</h1>
      <ScheduleTableClient periods={sortedPeriods} now={now} />
    </div>
  );
}
