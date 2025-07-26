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

export const BreadcrumbBits = {
  Catalyst: () => (
    <BreadcrumbItem>
      <BreadcrumbLink href="/app">Catalyst</BreadcrumbLink>
    </BreadcrumbItem>
  ),
  Todo: ({ asLink = true }: { asLink?: boolean }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href="/app/todo">{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Todo</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  TodoCreate: ({ asLink = true }: { asLink?: boolean }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href="/app/todo/create">{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Create</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  TodoItem: ({ id, asLink = false }: { id: number; asLink?: boolean }) => {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        const req = await fetch(`/api/todo/get-note/${id}`);
        const res = (await req.json()) as {
          success: boolean;
          data: PlannerNote | undefined;
          errors: { message: string }[];
        };
        const data = res?.data;
        setName(data?.title ?? "Item Not Found");
      })().catch(console.error);
    }, [id]);

    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/todo/${id}`}>{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );

    return (
      <BreadcrumbItem>
        <BreadcrumbRender>
          {name ?? <Skeleton className="h-4 w-[20ch] rounded-full" />}
        </BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Schools: ({ asLink = true }: { asLink?: boolean }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href="/app/schools">{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Schools</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
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
        const req = await fetch(`/api/catalyst/schools/get?id=${schoolId}`);
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

    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/schools/${schoolId}`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>
          {name ?? <Skeleton className="h-4 w-[20ch] rounded-full" />}
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
  }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/schools/${schoolId}/manage`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Manage</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  SchoolManagePeriods: ({
    schoolId,
    asLink = true,
  }: {
    schoolId?: string;
    asLink?: boolean;
  }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/schools/${schoolId}/manage/periods`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Periods</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  SchoolManageSchedule: ({
    schoolId,
    asLink = true,
  }: {
    schoolId?: string;
    asLink?: boolean;
  }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/schools/${schoolId}/manage/schedules`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Schedule</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  SchoolManageScheduleDates: ({
    schoolId,
    asLink = true,
  }: {
    schoolId?: string;
    asLink?: boolean;
  }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink
          href={`/app/schools/${schoolId}/manage/schedules/dates`}
        >
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Schedule Dates</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Courses: ({ asLink = true }: { asLink?: boolean }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href="/app/courses">{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Courses</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
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

    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/courses/${courseId}`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );

    return (
      <BreadcrumbItem>
        <BreadcrumbRender>
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
  }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/courses/${courseId}/pages`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Pages</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
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
        const req = await fetch(`/api/courses/${courseId}/page/${pageId}`);
        const res = (await req.json()) as {
          success: boolean;
          data: PlannerNote | null;
          errors: { message: string }[];
        };
        const data = res?.data;
        setName(data?.title ?? "Item Not Found");
      })().catch(console.error);
    }, [courseId, pageId]);

    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/courses/${courseId}/${pageId}`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );

    return (
      <BreadcrumbItem>
        <BreadcrumbRender>
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
  }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/courses/${courseId}/modules`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Modules</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  People: ({
    courseId,
    asLink = true,
  }: {
    courseId: number;
    asLink?: boolean;
  }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/courses/${courseId}/people`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>People</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Assignments: ({
    courseId,
    asLink = true,
  }: {
    courseId: number;
    asLink?: boolean;
  }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/courses/${courseId}/assignments`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Assignments</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
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

    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink
          href={`/app/courses/${courseId}/assignments/${assignmentId}`}
        >
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );

    return (
      <BreadcrumbItem>
        <BreadcrumbRender>
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
  }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/courses/${courseId}/grades`}>
          {children}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );

    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Grades</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Edit: ({ asLink = true, href }: { asLink?: boolean; href?: string }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={href ?? ""}>{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Edit</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Feedback: ({ asLink = true }: { asLink?: boolean }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href="/app/settings">{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Feedback</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Schedule: ({ asLink = true }: { asLink?: boolean }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href="/app/schedule">{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Schedule</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  ScheduleNow: ({ asLink = true }: { asLink?: boolean }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href="/app/schedule/now">{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Now</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
  Settings: ({ asLink = true }: { asLink?: boolean }) => {
    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href="/app/settings">{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );
    return (
      <BreadcrumbItem>
        <BreadcrumbRender>Settings</BreadcrumbRender>
      </BreadcrumbItem>
    );
  },
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
                    <BreadcrumbBits.Schedule />
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
