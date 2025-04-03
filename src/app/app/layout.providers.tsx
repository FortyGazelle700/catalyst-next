"use client";

import { CourseListWithPeriodDataOutput } from "@/server/api/canvas/courses/list-with-period-data";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type CoursesContextValue =
  | (Omit<CourseListWithPeriodDataOutput[0], "time"> & {
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

function TimeProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const msToNextSecond = 1000 - now.getMilliseconds();
    setTimeout(() => {
      interval = setInterval(() => setNow(new Date()), 1000);
      setNow(new Date());
    }, msToNextSecond);
    return () => clearInterval(interval);
  }, []);

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

  const lastFetch = useRef(new Date());
  const unfocused = useRef(false);

  useEffect(() => {
    const code = async () => {
      const req = await fetch("/api/courses/list-with-period-data");
      let { data: courses } = await req.json();
      courses = courses.map((course: CourseListWithPeriodDataOutput[0]) => {
        if (course.classification == "Not Available") {
          course.classification = ssrCourses.find(
            (c) => c.id == course.id
          )?.classification;
        }
        return course;
      });
      setOriginalCourses(courses);
      lastFetch.current = new Date();
    };
    code().catch(console.error);
    setInterval(code, 60 * 60 * 1000);
    window.addEventListener("focus", () => {
      if (new Date().getTime() - lastFetch.current.getTime() > 60 * 1000) {
        code().catch(console.error);
      }
    });
  }, []);

  useEffect(() => {
    const newCourses = originalCourses.map((originalCourse) => {
      let course = originalCourse as unknown as CoursesContextValue[0];
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
        `${now.toISOString().split("T")[0]}T${course.time?.startTime}Z`
      );
      const end = new Date(
        `${now.toISOString().split("T")[0]}T${course.time?.endTime}Z`
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
            now.getTime() < (course.time?.end?.getTime() ?? 0)
        )
        .sort((a, b) => +a.time.start! - +b.time.start!)[0];

      if (nextCourse) {
        nextCourse.time.activePinned = true;
      }
    }
    if (courses.length == 0 || now.getSeconds() == 0 || unfocused.current == true) {
      unfocused.current = false;
      setCourses(newCourses);
    }
    window.addEventListener("blur", () => {
      unfocused.current = true;
    })
  }, [now, originalCourses]);

  return (
    <CoursesContext.Provider value={courses}>
      {children}
    </CoursesContext.Provider>
  );
}

export function AppLayoutProviders({
  children,
  courses,
}: {
  children: React.ReactNode;
  courses: CourseListWithPeriodDataOutput;
}) {
  return (
    <TimeProvider>
      <CourseProvider courses={courses}>{children}</CourseProvider>
    </TimeProvider>
  );
}
