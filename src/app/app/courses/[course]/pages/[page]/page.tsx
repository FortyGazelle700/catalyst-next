import { api } from "@/server/api";
import { type Metadata } from "next";

export async function generateMetadata({
  params: paramList,
}: {
  params: Promise<{ course: string; page: string }>;
}): Promise<Metadata> {
  const params = await paramList;
  const todoItem = await (
    await api({})
  ).canvas.courses.page({
    courseId: Number(params.course),
    pageId: params.page,
  });

  return {
    title: todoItem.data?.title,
  };
}

export default async function CourseHomePage({
  params,
}: {
  params: Promise<{ course: string; page: string }>;
}) {
  const courseId = (await params).course;
  const pageId = (await params).page;

  const { data: page } = await (
    await api({})
  ).canvas.courses.page({
    courseId: Number(courseId),
    pageId: pageId,
  });

  function prettyBody(str?: string) {
    if (!str) return "";
    str = str.replace(/<script.*?<\/script>/g, "");
    return replaceCanvasURL(str);
  }

  function replaceCanvasURL(str: string) {
    const baseURL = `${
      process.env.PUBLISH_URL ?? "http://localhost:3000"
    }/app/`;
    const pattern =
      /https:\/\/[a-zA-Z0-9.-]+\.instructure\.com\/(?:api\/v1\/)?/g;
    return str.split(pattern).join(baseURL);
  }

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: prettyBody(page?.body) }}
        // dangerouslySetInnerHTML={{ __html: page.body }}
        className="render-fancy render-white-content mx-auto max-w-[min(100ch,100%)] overflow-auto p-4"
      />
    </div>
  );
}
