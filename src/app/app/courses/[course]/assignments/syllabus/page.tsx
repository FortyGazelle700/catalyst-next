import { redirect } from "next/navigation";

export default async function CourseSyllabusPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  redirect(`/app/courses/${(await params).course}/syllabus`);
}
