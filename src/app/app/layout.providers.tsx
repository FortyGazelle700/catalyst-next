"use client";

import { type CourseListWithPeriodDataOutput } from "@/server/api/canvas/courses/list-with-period-data";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CommandMenuProvider } from "./command-menu";
import { useRouter, usePathname } from "next/navigation";

type CoursesContextValue = (Omit<CourseListWithPeriodDataOutput[0], "time"> & {
  time: {
    start?: Date;
    end?: Date;
    startTime: string;
    endTime: string;
    active: boolean;
    activePinned: boolean;
  };
})[];

export const TimeContext = createContext<Date>(new Date());
export const CoursesContext = createContext<CoursesContextValue>([]);
export const CoursesRefreshContext = createContext<
  Dispatch<SetStateAction<number>>
>(() => {
  /**/
});

function TimeProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const msToNextSecond = 60 * 1000 - now.getMilliseconds();
    setTimeout(() => {
      interval = setInterval(() => setNow(new Date()), 1000);
      setNow(new Date());
    }, msToNextSecond);
    return () => clearInterval(interval);
  }, [now]);

  return <TimeContext.Provider value={now}>{children}</TimeContext.Provider>;
}

function CourseProvider({
  children,
  courses: ssrCourses,
}: {
  children: React.ReactNode;
  courses: CourseListWithPeriodDataOutput;
}) {
  const now = useContext(TimeContext);
  const [originalCourses, setOriginalCourses] =
    useState<CourseListWithPeriodDataOutput>(ssrCourses);
  const [courses, setCourses] = useState<CoursesContextValue>([]);

  const [forceRefresh, setForce] = useState(Math.random());

  const lastFetch = useRef(new Date());
  const unfocused = useRef(false);

  useEffect(() => {
    const code = async () => {
      const req = await fetch("/api/courses/list-with-period-data");
      let { data: courses } = (await req.json()) as {
        success: boolean;
        data: CourseListWithPeriodDataOutput;
        errors?: { message: string }[];
      };
      courses = courses.map((course: CourseListWithPeriodDataOutput[0]) => {
        if (course.classification == "Not Available") {
          course.classification = ssrCourses.find(
            (c) => c.id == course.id,
          )?.classification;
        }
        return course;
      });
      setOriginalCourses(courses);
      lastFetch.current = new Date();
    };
    code().catch(console.error);
    setTimeout(() => {
      code().catch(console.error);
    }, 10 * 1000);
    setInterval(() => {
      code().catch(console.error);
    }, 60 * 1000);
    window.addEventListener("focus", () => {
      if (new Date().getTime() - lastFetch.current.getTime() > 30 * 1000) {
        code().catch(console.error);
      }
    });
  }, [ssrCourses, forceRefresh]);

  useEffect(() => {
    const newCourses = originalCourses.map((originalCourse) => {
      const course = originalCourse as unknown as CoursesContextValue[0];
      if (!course.time) {
        course.time = {
          start: undefined,
          end: undefined,
          startTime: "",
          endTime: "",
          active: false,
          activePinned: false,
        };
        return course;
      }
      const start = new Date(
        `${now.toISOString().split("T")[0]}T${course.time?.startTime}Z`,
      );
      const end = new Date(
        `${now.toISOString().split("T")[0]}T${course.time?.endTime}Z`,
      );

      if (start.getDate() != now.getDate()) start.setDate(now.getDate());
      if (end.getDate() != now.getDate()) end.setDate(now.getDate());

      if (end < start) end.setDate(end.getDate() + 1);

      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        course.time.start = undefined;
        course.time.end = undefined;
        course.time.active = false;
        course.time.activePinned = false;
        return course;
      }

      const isActive =
        course.time?.start && course.time?.end
          ? start?.getTime() <= now.getTime() && now.getTime() < end?.getTime()
          : false;

      course.time.start = start;
      course.time.end = end;
      course.time.active = isActive;
      course.time.activePinned = course.time.active;

      return course;
    }) as CoursesContextValue;
    const currentCourse = newCourses.find((course) => course.time?.active);
    if (!currentCourse) {
      const nextCourse = newCourses
        .filter(
          (course) =>
            (course.time?.start?.getTime() ?? 0) > now.getTime() &&
            now.getTime() < (course.time?.end?.getTime() ?? 0),
        )
        .sort((a, b) => +a.time.start! - +b.time.start!)[0];

      if (nextCourse) {
        nextCourse.time.activePinned = true;
      }
    }
    if (
      courses.length == 0 ||
      now.getSeconds() == 0 ||
      unfocused.current == true
    ) {
      unfocused.current = false;
      setCourses(newCourses);
    }
    window.addEventListener("blur", () => {
      unfocused.current = true;
    });
  }, [courses.length, now, originalCourses]);

  return (
    <CoursesRefreshContext.Provider value={setForce}>
      <CoursesContext.Provider value={courses}>
        {children}
      </CoursesContext.Provider>
    </CoursesRefreshContext.Provider>
  );
}

function SessionVerificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifySession = async () => {
      const res = await fetch("/api/catalyst/account/ping");
      if (!res.ok) {
        console.error("Session verification failed:", res.statusText);
        router.replace("/app/auth");
        return;
      }
      const data = (await res.json()) as {
        success: boolean;
        data: null;
        errors: { message: string }[];
      };
      if (!data.success) {
        console.error("Session verification failed:", data.errors);
        router.replace("/app/auth");
      }
    };

    verifySession().catch(console.error);
    const check = setInterval(
      () => {
        verifySession().catch(console.error);
      },
      10 * 60 * 1000,
    );

    return () => {
      clearInterval(check);
    };
  }, [router, pathname]);

  return <>{children}</>;
}

export function AppLayoutProviders({
  children,
  courses,
}: {
  children: React.ReactNode;
  courses: CourseListWithPeriodDataOutput;
}) {
  return (
    <SessionVerificationProvider>
      <CommandMenuProvider>
        <TimeProvider>
          <CourseProvider courses={courses}>{children}</CourseProvider>
        </TimeProvider>
      </CommandMenuProvider>
    </SessionVerificationProvider>
  );
}
