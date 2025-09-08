import { api } from "@/server/api";
import { notFound } from "next/navigation";
import { AssignmentSidebar } from "./page.client";
import { type Metadata } from "next";
import { localeDateString } from "@/components/util/format-date-client";

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
    const baseURL = `${
      process.env.PUBLISH_URL ?? "http://localhost:3000"
    }/app/`;
    const pattern =
      /https:\/\/[a-zA-Z0-9.-]+\.instructure\.com\/(?:api\/v1\/)?/g;
    return str.split(pattern).join(baseURL);
  }

  return (
    <div className="@container flex h-full w-full" data-container="assignment">
      <div className="flex h-max w-full flex-col-reverse items-stretch overflow-auto @4xl:h-full @4xl:flex-row @4xl:overflow-hidden">
        <div className="min-h-max flex-1 overflow-x-auto p-4 @4xl:min-h-auto @4xl:overflow-auto">
          <h1 className="h1 mb-2">{assignment.name}</h1>
          {assignment.locked_for_user && (
            <div className="mb-4 rounded-md bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
              This assignment is currently locked. (
              {(() => {
                if (
                  new Date(assignment.unlock_at ?? "").getTime() >= Date.now()
                ) {
                  return `Unlocks at: ${localeDateString(
                    assignment.unlock_at ?? "",
                    undefined,
                    {
                      dateStyle: "long",
                      timeStyle: "short",
                    },
                  )}`;
                } else if (
                  new Date(assignment.lock_at ?? "").getTime() <= Date.now()
                ) {
                  return `Locked at: ${localeDateString(
                    assignment.lock_at ?? "",
                    undefined,
                    {
                      dateStyle: "long",
                      timeStyle: "short",
                    },
                  )}`;
                } else {
                  return "No lock information";
                }
              })()}
              )
            </div>
          )}
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
