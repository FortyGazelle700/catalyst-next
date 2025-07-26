import { api } from "@/server/api";
import { notFound } from "next/navigation";
import SchoolPageClient from "./page.client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School / Manage",
};

export default async function SchoolManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: school } = await (
    await api({})
  ).catalyst.schools.get({ id: (await params).id });

  if (!school) {
    return notFound();
  }

  const { data: role } = await (
    await api({})
  ).catalyst.schools.getPermissions({ id: school.id });

  const canManage = role == "owner" || role == "admin";

  if (!canManage) {
    return notFound();
  }

  return (
    <div className="@container mx-auto flex w-full max-w-[120ch] flex-col gap-6 px-12 py-8">
      <SchoolPageClient school={school} />
    </div>
  );
}
