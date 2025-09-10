import { api } from "@/server/api";
import { notFound, redirect } from "next/navigation";

export default async function RetrieveExternalToolPage({
  params,
  searchParams,
}: {
  params: { course: string };
  searchParams: Record<string, string>;
}) {
  const { data: redirectUrl } = await (
    await api({})
  ).canvas.courses.externalTools.retrieve({
    courseId: Number(params.course),
    externalURL: new URL(searchParams?.url ?? ""),
  });

  if (redirectUrl?.url) {
    redirect(redirectUrl?.url);
  } else {
    notFound();
  }
}
