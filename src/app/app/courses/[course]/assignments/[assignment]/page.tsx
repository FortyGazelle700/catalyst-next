import { api } from "@/server/api";
import { notFound } from "next/navigation";
import { AssignmentSidebar } from "./page.client";
import { type Metadata } from "next";

export async function generateMetadata({
  params: paramList,
}: {
  params: Promise<{ course: string; assignment: string }>;
}): Promise<Metadata> {
  const params = await paramList;
  const todoItem = await (
    await api({})
  ).canvas.courses.assignments.get({
    courseId: Number(params.course),
    assignmentId: Number(params.assignment),
  });

  return {
    title: todoItem.data?.name,
  };
}

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{
    course: string;
    assignment: string;
  }>;
}) {
  const courseId = (await params).course;
  const assignmentId = (await params).assignment;

  const { data: assignment } = await (
    await api({})
  ).canvas.courses.assignments.get({
    courseId: Number(courseId),
    assignmentId: Number(assignmentId),
  });

  if (!assignment) {
    notFound();
  }

  function prettyBody(str?: string) {
    if (!str) return "";
    str = str.replace(/<script.*?<\/script>/g, "");
    return replaceCanvasURL(str);
  }

  function replaceCanvasURL(str: string) {
    const baseURL = `/${
      process.env.PUBLISH_URL ?? "http://localhost:3000"
    }/app/`;
    const pattern =
      /https:\/\/[a-zA-Z0-9.-]+\.instructure\.com\/(?:api\/v1\/)?/g;
    return str.split(pattern).join(baseURL);
  }

  return (
    <div className="@container flex h-full w-full" data-container="assignment">
      <div className="flex h-full w-full flex-col-reverse items-stretch overflow-auto @4xl:flex-row @4xl:overflow-hidden">
        <div className="min-h-auto flex-1 overflow-x-auto p-4 @4xl:overflow-auto">
          <h1 className="h1 mb-2">{assignment.name}</h1>
          <div
            className="render-fancy"
            dangerouslySetInnerHTML={{
              __html: prettyBody(assignment.description),
            }}
          />
        </div>
        <AssignmentSidebar assignment={assignment} />
      </div>
    </div>
  );
}
