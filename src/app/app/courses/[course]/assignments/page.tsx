import { redirect } from "next/navigation";

export default function AssignmentRedirect({
  params,
}: {
  params: { course: string };
}) {
  redirect(`/app/courses/${params.course}/modules`);
}
