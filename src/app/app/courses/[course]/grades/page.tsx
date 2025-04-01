import { Metadata } from "next";
import GradesClientPage from "./page.client";
import { api } from "@/server/api";

export const metadata: Metadata = {
  title: "Grades",
};

export default async function GradesPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const { data: grades } = await (
    await api({})
  ).canvas.courses.grades({
    courseId: Number(course),
  });
  return <GradesClientPage course={Number(course)} grades={grades} />;
}
