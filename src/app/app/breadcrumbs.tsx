"use client";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { type Assignment, type PlannerNote } from "@/server/api/canvas/types";
import { useParams, usePathname } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { CoursesContext } from "./layout.providers";

function BreadcrumbRender({
  asLink,
  href,
  children,
}: {
  asLink?: boolean;
  href?: string;
  children: React.ReactNode;
}) {
  return asLink ? (
    <BreadcrumbLink href={href ?? ""}>{children}</BreadcrumbLink>
  ) : (
    <BreadcrumbPage>{children}</BreadcrumbPage>
  );
}

export const BreadcrumbBits = {
  Catalyst: () => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink href="/app">
        Catalyst
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Todo: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/todo">
        Todo
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  TodoCreate: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/todo/create">
        Create
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  TodoItem: ({ id, asLink = false }: { id: number; asLink?: boolean }) => {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        const req = await fetch(`/api/todo/get-note/${id}`, {
          cache: "force-cache",
          next: { revalidate: 24 * 60 * 60 },
        });
        const res = (await req.json()) as {
          success: boolean;
          data: PlannerNote | undefined;
          errors: { message: string }[];
        };
        const data = res?.data;
        setName(data?.title ?? "Item Not Found");
      })().catch(console.error);
    }, [id]);

    return (
      <BreadcrumbItem>
        <BreadcrumbRender asLink={asLink} href={`/app/todo/${id}`}>
          {name ?? <Skeleton className="h-4 w-[20ch] rounded-full" />}
        </BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Schools: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/schools">
        Schools
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  School: ({
    schoolId,
    asLink = true,
  }: {
    schoolId?: string;
    asLink?: boolean;
  }) => {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        if (schoolId == undefined) return;
        const req = await fetch(`/api/catalyst/schools/get?id=${schoolId}`, {
          cache: "force-cache",
          next: { revalidate: 24 * 60 * 60 },
        });
        const res = (await req.json()) as {
          success: boolean;
          data: {
            id: string;
            name: string;
          } | null;
          errors: { message: string }[];
        };
        const data = res?.data;
        setName(data?.name ?? "Item Not Found");
      })().catch(console.error);
    }, [schoolId]);

    return (
      <BreadcrumbItem>
        <BreadcrumbRender asLink={asLink} href={`/app/schools/${schoolId}`}>
          {name ?? <Skeleton className="h-4 w-[20ch] rounded-full" />}
        </BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  SchoolSchedules: ({
    schoolId,
    asLink = true,
  }: {
    schoolId?: string;
    asLink?: boolean;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/schools/${schoolId}/schedules`}
      >
        Schedules
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  SchoolSchedule: ({
    schoolId,
    scheduleId,
    asLink = true,
  }: {
    schoolId?: string;
    scheduleId?: string;
    asLink?: boolean;
  }) => {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        if (schoolId == undefined) return;
        const req = await fetch(
          `/api/catalyst/schools/${schoolId}/schedules/${scheduleId}/get`,
          {
            cache: "force-cache",
            next: { revalidate: 24 * 60 * 60 },
          },
        );
        const res = (await req.json()) as {
          success: boolean;
          data: {
            id: string;
            name: string;
          } | null;
          errors: { message: string }[];
        };
        const data = res?.data;
        setName(data?.name ?? "Item Not Found");
      })().catch(console.error);
    }, [scheduleId, schoolId]);

    return (
      <BreadcrumbItem>
        <BreadcrumbRender
          asLink={asLink}
          href={`/app/schools/${schoolId}/schedules/${scheduleId}`}
        >
          {name ? (
            `${name} Schedule`
          ) : (
            <Skeleton className="h-4 w-[20ch] rounded-full" />
          )}
        </BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  SchoolManage: ({
    schoolId,
    asLink = true,
  }: {
    schoolId?: string;
    asLink?: boolean;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/schools/${schoolId}/manage`}
      >
        Manage
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  SchoolManagePeriods: ({
    schoolId,
    asLink = true,
  }: {
    schoolId?: string;
    asLink?: boolean;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/schools/${schoolId}/manage/periods`}
      >
        Periods
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  SchoolManageSchedule: ({
    schoolId,
    asLink = true,
  }: {
    schoolId?: string;
    asLink?: boolean;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/schools/${schoolId}/manage/schedules`}
      >
        Schedule
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  SchoolManageScheduleDates: ({
    schoolId,
    asLink = true,
  }: {
    schoolId?: string;
    asLink?: boolean;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/schools/${schoolId}/manage/schedules/dates`}
      >
        Schedule Dates
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Social: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/social">
        Social
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  SocialCanvas: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/social/chats/canvas">
        Canvas
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  SocialCanvasMessage: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/social/chats/canvas/[id]">
        Message
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Upgrade: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/settings?page=/upgrade">
        Upgrade
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  UpgradeSuccess: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/settings?page=/upgrade">
        Success
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Courses: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/courses">
        Courses
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Course: ({
    asLink = true,
    courseId: courseId,
  }: {
    asLink?: boolean;
    courseId?: number;
  }) => {
    const courses = useContext(CoursesContext);
    const currentCourse = useMemo(
      () => courses.find((c) => c.id === courseId),
      [courses, courseId],
    );

    return (
      <BreadcrumbItem>
        <BreadcrumbRender asLink={asLink} href={`/app/courses/${courseId}`}>
          {currentCourse ? (
            currentCourse.original_name
          ) : (
            <Skeleton className="h-4 w-[20ch] rounded-full" />
          )}
        </BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Pages: ({
    asLink = true,
    courseId,
  }: {
    asLink?: boolean;
    courseId?: number;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href={`/app/courses/${courseId}/pages`}>
        Pages
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Page: ({
    asLink = true,
    courseId,
    pageId,
  }: {
    asLink?: boolean;
    courseId?: number;
    pageId?: string;
  }) => {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        const req = await fetch(`/api/courses/${courseId}/page/${pageId}`, {
          cache: "force-cache",
          next: { revalidate: 24 * 60 * 60 },
        });
        const res = (await req.json()) as {
          success: boolean;
          data: PlannerNote | null;
          errors: { message: string }[];
        };
        const data = res?.data;
        setName(data?.title ?? "Item Not Found");
      })().catch(console.error);
    }, [courseId, pageId]);

    return (
      <BreadcrumbItem>
        <BreadcrumbRender
          asLink={asLink}
          href={`/app/courses/${courseId}/${pageId}`}
        >
          {name ?? <Skeleton className="h-4 w-[20ch] rounded-full" />}
        </BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Modules: ({
    asLink = true,
    courseId,
  }: {
    asLink?: boolean;
    courseId?: number;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/courses/${courseId}/modules`}
      >
        Modules
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Syllabus: ({
    courseId,
    asLink = true,
  }: {
    courseId: number;
    asLink?: boolean;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/courses/${courseId}/syllabus`}
      >
        Syllabus
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  People: ({
    courseId,
    asLink = true,
  }: {
    courseId: number;
    asLink?: boolean;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/courses/${courseId}/people`}
      >
        People
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Assignments: ({
    courseId,
    asLink = true,
  }: {
    courseId: number;
    asLink?: boolean;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/courses/${courseId}/assignments`}
      >
        Assignments
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Assignment: ({
    courseId,
    assignmentId,
    asLink = true,
  }: {
    courseId: number;
    assignmentId: number;
    asLink?: boolean;
  }) => {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        const req = await fetch(
          `/api/courses/${courseId}/assignments/${assignmentId}`,
          { cache: "force-cache" },
        );
        const res = (await req.json()) as {
          success: boolean;
          data: Assignment | null;
          errors: { message: string }[];
        };
        const data = res?.data;
        setName(data?.name ?? "Item Not Found");
      })().catch(console.error);
    }, [assignmentId, courseId]);

    return (
      <BreadcrumbItem>
        <BreadcrumbRender
          asLink={asLink}
          href={`/app/courses/${courseId}/assignments/${assignmentId}`}
        >
          {name ?? <Skeleton className="h-4 w-[20ch] rounded-full" />}
        </BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Grades: ({
    courseId,
    asLink = true,
  }: {
    courseId: number;
    asLink?: boolean;
  }) => (
    <BreadcrumbItem>
      <BreadcrumbRender
        asLink={asLink}
        href={`/app/courses/${courseId}/grades`}
      >
        Grades
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Edit: ({ asLink = true, href }: { asLink?: boolean; href?: string }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href={href ?? ""}>
        Edit
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Feedback: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/settings">
        Feedback
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Schedule: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/schedule">
        Schedule
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  ScheduleNow: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/schedule/now">
        Now
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Settings: ({ asLink = true }: { asLink?: boolean }) => (
    <BreadcrumbItem>
      <BreadcrumbRender asLink={asLink} href="/app/settings">
        Settings
      </BreadcrumbRender>
    </BreadcrumbItem>
  ),
  Error404: () => (
    <BreadcrumbItem>
      <BreadcrumbPage>Error: 404</BreadcrumbPage>
    </BreadcrumbItem>
  ),
};

export function Breadcrumbs({
  pathname: givenPathname,
  params: givenParams,
}: {
  pathname?: string;
  params?: Record<string, string>;
}) {
  const genParams = useParams<Record<string, string>>();
  const genPathname = usePathname();
  const params = givenParams ?? genParams;
  const pathname = givenPathname ?? genPathname;
  let pathId = pathname;

  Object.entries(params).forEach(
    ([k, v]) => (pathId = pathId.replace(String(v), `[${k}]`)),
  );

  return (
    <Breadcrumb className="w-full overflow-hidden">
      <BreadcrumbList className="flex flex-nowrap items-center gap-2 overflow-x-auto [&_*]:whitespace-nowrap">
        <>
          {(() => {
            switch (pathId) {
              case "/app":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                );
              case "/app/todo":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Todo asLink={false} />
                  </>
                );
              case "/app/todo/create":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Todo />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.TodoCreate asLink={false} />
                  </>
                );
              case "/app/todo/[id]":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Todo />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.TodoItem id={Number(params.id)} />
                  </>
                );
              case "/app/todo/[id]/edit":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Todo />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.TodoItem id={Number(params.id)} asLink />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Edit />
                  </>
                );
              case "/app/schools":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schools />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.School
                      schoolId={undefined}
                      asLink={false}
                    />
                  </>
                );
              case "/app/schools/[id]":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schools />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.School
                      schoolId={params.id ?? ""}
                      asLink={false}
                    />
                  </>
                );
              case "/app/schools/[id]/schedules":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schools />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.School schoolId={params.id ?? ""} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolSchedules
                      schoolId={params.id ?? ""}
                      asLink={false}
                    />
                  </>
                );
              case "/app/schools/[id]/schedules/[schedule]":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schools />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.School schoolId={params.id ?? ""} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolSchedules
                      schoolId={params.id ?? ""}
                    />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolSchedule
                      schoolId={params.id ?? ""}
                      scheduleId={params.schedule ?? ""}
                      asLink={false}
                    />
                  </>
                );
              case "/app/schools/[id]/manage":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schools />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.School schoolId={params.id ?? ""} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolManage
                      schoolId={params.id ?? ""}
                      asLink={false}
                    />
                  </>
                );
              case "/app/schools/[id]/manage/periods":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schools />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.School schoolId={params.id ?? ""} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolManage schoolId={params.id ?? ""} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolManagePeriods
                      schoolId={params.id ?? ""}
                      asLink={false}
                    />
                  </>
                );
              case "/app/schools/[id]/manage/schedules":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schools />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.School schoolId={params.id ?? ""} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolManage schoolId={params.id ?? ""} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolManageSchedule
                      schoolId={params.id ?? ""}
                      asLink={false}
                    />
                  </>
                );
              case "/app/schools/[id]/manage/schedules/dates":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schools />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.School schoolId={params.id ?? ""} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolManage schoolId={params.id ?? ""} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolManageSchedule
                      schoolId={params.id ?? ""}
                    />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SchoolManageScheduleDates
                      schoolId={params.id ?? ""}
                      asLink={false}
                    />
                  </>
                );
              case "/app/social":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Social />
                  </>
                );
              case "/app/social/chats":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Social />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SocialCanvas asLink={false} />
                  </>
                );
              case "/app/social/chats/canvas":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Social />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SocialCanvas asLink={false} />
                  </>
                );
              case "/app/social/chats/canvas/[id]":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Social />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SocialCanvas asLink={false} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.SocialCanvasMessage asLink={false} />
                  </>
                );
              case "/app/upgrade/confirm":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Upgrade asLink={false} />
                  </>
                );
              case "/app/upgrade/success":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Upgrade asLink={true} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.UpgradeSuccess asLink={false} />
                  </>
                );
              case "/app/courses":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Courses asLink={false} />
                  </>
                );
              case "/app/courses/[course]":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Courses />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Course
                      courseId={Number(params.course)}
                      asLink={false}
                    />
                  </>
                );
              case "/app/courses/[course]/syllabus":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Courses />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Course courseId={Number(params.course)} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Syllabus
                      courseId={Number(params.course)}
                      asLink={false}
                    />
                  </>
                );
              case "/app/courses/[course]/people":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Courses />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Course courseId={Number(params.course)} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.People
                      courseId={Number(params.course)}
                      asLink={false}
                    />
                  </>
                );
              case "/app/courses/[course]/pages/[page]":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Courses />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Course courseId={Number(params.course)} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Pages courseId={Number(params.course)} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Page
                      courseId={Number(params.course)}
                      pageId={params.page}
                      asLink={false}
                    />
                  </>
                );
              case "/app/courses/[course]/assignments":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Courses />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Course courseId={Number(params.course)} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Assignments
                      courseId={Number(params.course)}
                    />
                  </>
                );
              case "/app/courses/[course]/assignments/[assignment]":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Courses />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Course courseId={Number(params.course)} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Assignments
                      courseId={Number(params.course)}
                    />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Assignment
                      courseId={Number(params.course)}
                      assignmentId={Number(params.assignment)}
                      asLink={false}
                    />
                  </>
                );
              case "/app/courses/[course]/modules":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Courses />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Course courseId={Number(params.course)} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Modules
                      courseId={Number(params.course)}
                      asLink={false}
                    />
                  </>
                );
              case "/app/courses/[course]/grades":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Courses />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Course courseId={Number(params.course)} />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Grades
                      courseId={Number(params.course)}
                      asLink={false}
                    />
                  </>
                );
              case "/app/feedback":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Feedback asLink={false} />
                  </>
                );
              case "/app/schedule":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schedule asLink={false} />
                  </>
                );
              case "/app/schedule/now":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Schedule />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.ScheduleNow asLink={false} />
                  </>
                );
              case "/app/settings":
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Settings asLink={false} />
                  </>
                );
              default:
                return (
                  <>
                    <BreadcrumbBits.Catalyst />
                    <BreadcrumbSeparator />
                    <BreadcrumbBits.Error404 />
                  </>
                );
            }
          })()}
        </>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
