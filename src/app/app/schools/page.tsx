import { api } from "@/server/api";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "School",
};

export default async function SchoolPage() {
  const { data: school_id } = await (
    await api({})
  ).catalyst.account.settings.get({
    key: "school_id",
  });

  redirect(`/app/schools/${school_id}`);
}
