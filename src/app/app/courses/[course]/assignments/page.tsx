import { redirect } from "next/navigation";

export default async function AssignmentRedirect({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  redirect(`/app/courses/${(await params).course}/modules`);
}
