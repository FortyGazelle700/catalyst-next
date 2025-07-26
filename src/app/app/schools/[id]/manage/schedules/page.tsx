import { api } from "@/server/api";
import SchedulePageClient from "./page.client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School / Manage / Schedules",
};

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;

  const { data: schedules } = await (
    await api({})
  ).catalyst.schools.schedules.detailedList({ id: schoolId });

  const { data: periods } = await (
    await api({})
  ).catalyst.schools.periods.list({ id: schoolId });

  return (
    <div className="@container mx-auto flex w-full max-w-[120ch] flex-col gap-6 px-12 py-8">
      <SchedulePageClient
        schoolId={schoolId}
        periods={periods}
        schedules={schedules}
      />
    </div>
  );
}
