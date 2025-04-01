import { api } from "@/server/api";
import ScheduleClientPage from "./page.client";

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

  return <ScheduleClientPage courses={courses ?? []} periods={periods ?? []} />;
}
``;
