import { api } from "@/server/api";
import { notFound } from "next/navigation";
import PeriodsPageClient from "./page.client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School / Manage / Periods",
};

export default async function SchoolManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  const { data: periods } = await (
    await api({})
  ).catalyst.schools.periods.list({ id: schoolId });

  const newPeriods = periods?.map((period) => ({
    ...period,
    options: period.options ?? [],
  }));

  const { data: role } = await (
    await api({})
  ).catalyst.schools.getPermissions({ id: schoolId });

  const canManage = role == "owner" || role == "admin";

  if (!canManage) {
    return notFound();
  }

  return (
    <div className="@container mx-auto flex w-full max-w-[120ch] flex-col gap-6 px-12 py-8">
      <PeriodsPageClient schoolId={schoolId} periods={newPeriods} />
    </div>
  );
}
