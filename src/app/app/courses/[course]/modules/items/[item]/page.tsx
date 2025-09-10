import { api } from "@/server/api";
import { notFound, redirect } from "next/navigation";

export default async function RetrieveExternalToolPage({
  params,
}: {
  params: { course: string; item: string };
}) {
  const { data: module } = await (
    await api({})
  ).canvas.courses.modules.get({
    courseId: Number(params.course),
    itemId: Number(params.item),
  });

  if (module?.page_url) {
    redirect(`/app/courses/${params.course}/pages/${module?.page_url}`);
  } else {
    notFound();
  }
}
