import { type Metadata } from "next";
import ModuleClientPage from "./page.client";
import { api } from "@/server/api";

export const metadata = {
  title: "Modules",
} as Metadata;

export default async function ModulePage({
  params,
}: {
  params: Promise<{
    course: string;
  }>;
}) {
  const course = Number((await params).course);
  const { data: modules } = await (
    await api({})
  ).canvas.courses.modules.list({
    courseId: course,
  });

  return <ModuleClientPage modules={modules} />;
}
