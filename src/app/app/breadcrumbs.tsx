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
import { Assignment, PlannerNote } from "@/server/api/canvas/types";
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
  TodoItem: ({ id, asLink = false }: { id: number; asLink?: boolean }) => {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        const req = await fetch(`/api/todo/get-note/${id}`);
        const res = await req.json();
        const data = res?.data as PlannerNote | null;
        setName(data?.title ?? "Item Not Found");
      })();
    }, []);

    const BreadcrumbRender = ({ children }: { children: React.ReactNode }) =>
      asLink ? (
        <BreadcrumbLink href={`/app/todo/${id}`}>{children}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      );

    return (
      <BreadcrumbItem>
        <BreadcrumbRender>
          {name ? name : <Skeleton className="h-4 rounded-full w-[20ch]" />}
        </BreadcrumbRender>
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
      [courses, courseId]
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
          {currentCourse ? currentCourse.original_name : <Skeleton />}
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
        const res = await req.json();
        const data = res?.data as PlannerNote | null;
        setName(data?.title ?? "Item Not Found");
      })();
    }, []);

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
          {name ? name : <Skeleton className="h-4 rounded-full w-[20ch]" />}
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
          `/api/courses/${courseId}/assignments/${assignmentId}`
        );
        const res = await req.json();
        const data = res?.data as Assignment | null;
        setName(data?.name ?? "Item Not Found");
      })();
    }, []);

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
          {name ? name : <Skeleton className="h-4 rounded-full w-[20ch]" />}
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
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        const req = await fetch(`/api/courses/${courseId}/grades`);
        const res = await req.json();
        const data = res?.data as Assignment | null;
        setName(data?.name ?? "Item Not Found");
      })();
    }, []);

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
  Edit: ({ asLink, href }: { asLink?: boolean; href?: string }) => {
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
  Feedback: ({ asLink }: { asLink: boolean }) => {
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
  Settings: ({ asLink }: { asLink: boolean }) => {
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
  const params = givenParams
    ? givenParams
    : useParams<Record<string, string>>();
  const pathname = givenPathname ? givenPathname : usePathname();
  let pathId = pathname;

  Object.entries(params).forEach(
    ([k, v]) => (pathId = pathId.replace(String(v), `[${k}]`))
  );

  console.log(pathname, params, pathId);

  switch (pathId) {
    case "/app":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/todo":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Todo asLink={false} />
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/todo/[id]":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Todo />
            <BreadcrumbSeparator />
            <BreadcrumbBits.TodoItem id={Number(params.id)} />
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/todo/[id]/edit":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Todo />
            <BreadcrumbSeparator />
            <BreadcrumbBits.TodoItem id={Number(params.id)} asLink />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Edit />
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/courses":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Courses asLink={false} />
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/courses/[course]":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Courses />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Course
              courseId={Number(params.course)}
              asLink={false}
            />
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/courses/[course]/people":
      return (
        <Breadcrumb>
          <BreadcrumbList>
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
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/courses/[course]/pages/[page]":
      return (
        <Breadcrumb>
          <BreadcrumbList>
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
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/courses/[course]/assignments":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Courses />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Course courseId={Number(params.course)} />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Assignments courseId={Number(params.course)} />
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/courses/[course]/assignments/[assignment]":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Courses />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Course courseId={Number(params.course)} />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Assignments courseId={Number(params.course)} />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Assignment
              courseId={Number(params.course)}
              assignmentId={Number(params.assignment)}
              asLink={false}
            />
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/courses/[course]/modules":
      return (
        <Breadcrumb>
          <BreadcrumbList>
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
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/courses/[course]/grades":
      return (
        <Breadcrumb>
          <BreadcrumbList>
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
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/feedback":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Feedback asLink={false} />
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "/app/settings":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Settings asLink={false} />
          </BreadcrumbList>
        </Breadcrumb>
      );
    default:
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbBits.Catalyst />
            <BreadcrumbSeparator />
            <BreadcrumbBits.Error404 />
          </BreadcrumbList>
        </Breadcrumb>
      );
  }
}
