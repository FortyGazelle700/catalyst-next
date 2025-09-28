import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { api } from "@/server/api";
import { House, Link as LinkIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params: paramList,
}: {
  params: Promise<{ course: string; page: string }>;
}): Promise<Metadata> {
  const params = await paramList;
  const courseList = await (
    await api({})
  ).canvas.courses.list({
    useCache: true,
    limit: 1000,
    offset: 1,
  });
  const course = courseList.data?.find(
    (c) => String(c.id) == String(params.course),
  );

  return {
    title: course?.name,
  };
}

export default async function CourseHomePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const courseId = (await params).course;

  const courseList = await (
    await api({})
  ).canvas.courses.list({
    useCache: true,
    limit: 1000,
    offset: 1,
  });
  const course = courseList.data?.find((c) => String(c.id) == String(courseId));

  const { data: page } = await (
    await api({})
  ).canvas.courses.frontPage({
    courseId: Number(courseId),
  });

  const { data: links } = await (
    await api({})
  ).canvas.courses.sidebar({
    courseId: Number(courseId),
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
    <div className="@container flex h-full w-full">
      <div className="flex h-max w-full flex-col-reverse items-stretch overflow-auto @4xl:h-full @4xl:flex-row @4xl:overflow-hidden">
        <div
          dangerouslySetInnerHTML={{ __html: prettyBody(page?.body) }}
          className="render-fancy render-white-content mx-auto min-h-max max-w-[min(100ch,100%)] flex-1 overflow-auto overflow-x-auto p-4 @4xl:min-h-auto @4xl:overflow-auto"
        />
        <Sidebar
          collapsible="none"
          className="scrollbar-auto m-2 min-h-max w-[calc(100%-1rem)] overflow-auto rounded-xs @4xl:h-[calc(100%-var(--spacing)*4)] @4xl:w-[20rem]"
        >
          <SidebarHeader className="p-4">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <House className="shrink-0" /> {course?.name ?? "Course Home"}
            </h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-1 font-bold">
                <LinkIcon /> Links
              </SidebarGroupLabel>
              {links?.map((link) => (
                <Link
                  key={link.id}
                  href={replaceCanvasURL(link.full_url)}
                  target={link.type == "external" ? "_blank" : "_self"}
                  className="hover:bg-accent hover:text-accent-foreground block w-full rounded-xs px-4 py-2 text-sm"
                >
                  {link.label}
                </Link>
              )) ?? <p className="p-4">No links available.</p>}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </div>
  );
}
