import { api } from "@/server/api";
import { notFound, redirect } from "next/navigation";

export default async function RetrieveExternalToolPage({
  params,
}: {
  params: Promise<{ course: string; tool: string }>;
}) {
  const { data: redirectUrl } = await (
    await api({})
  ).canvas.courses.externalTools.retrieve({
    courseId: Number((await params).course),
    externalId: (await params).tool ?? "",
  });

  if (redirectUrl?.url) {
    redirect(redirectUrl?.url);
  } else {
    notFound();
  }
}
