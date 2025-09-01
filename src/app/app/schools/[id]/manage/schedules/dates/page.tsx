import { api } from "@/server/api";
import ScheduleDatesPageClient from "./page.client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School / Manage / Schedules Dates",
};

export default async function ScheduleDatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: schedules } = await (
    await api({})
  ).catalyst.schools.schedules.list({ id });

  const { data: dates } = await (
    await api({})
  ).catalyst.schools.schedules.dates.list.list({ id });

  const { data: datesSchedule } = await (
    await api({})
  ).catalyst.schools.schedules.dates.schedule.list({ id });

  while (datesSchedule.length < 7) {
    datesSchedule.push({
      id: crypto.randomUUID(),
      schoolId: id,
      scheduleId: "",
      repeat: datesSchedule.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return (
    <div className="@container mx-auto flex w-full max-w-[120ch] flex-col gap-6 px-12 py-8">
      <ScheduleDatesPageClient
        schoolId={id}
        schedules={schedules}
        dates={dates}
        datesSchedule={datesSchedule}
      />
    </div>
  );
}
