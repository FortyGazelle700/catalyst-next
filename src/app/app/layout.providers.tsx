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
import Pusher from "pusher-js";
import { pipManager } from "./manager.pip";
import type {
  CurrentScheduleWithCoursesOutput,
  SchedulePeriodWithCourse,
} from "@/server/api/canvas/courses/get-with-schedule";

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

type ScheduleContextValue = (Omit<SchedulePeriodWithCourse, "time"> & {
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
export const ScheduleContext = createContext<ScheduleContextValue>([]);
export const PubSubContext = createContext<Pusher | null>(null);
type PipItem = {
  open: () => Promise<void>;
  close: () => Promise<void>;
  toggle: () => Promise<void>;
  isOpen: () => boolean;
  canOpen: () => boolean;
};
export const PipContext = createContext<Record<string, PipItem> | null>(null);

function TimeProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateTime = () => setNow(new Date());

    // Calculate milliseconds to next second
    const currentTime = new Date();
    const msToNextSecond = 1000 - currentTime.getMilliseconds();

    // Set timeout to sync with the next second boundary
    const timeout = setTimeout(() => {
      updateTime(); // Update immediately when we hit the second boundary
      interval = setInterval(updateTime, 1000); // Then update every second
    }, msToNextSecond);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return <TimeContext.Provider value={now}>{children}</TimeContext.Provider>;
}

function CourseProvider({
  children,
  courses: ssrCourses,
}: {
  children: React.ReactNode;
  courses?: CourseListWithPeriodDataOutput;
}) {
  const now = useContext(TimeContext);
  const [originalCourses, setOriginalCourses] =
    useState<CourseListWithPeriodDataOutput>(ssrCourses ?? []);
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
          course.classification = ssrCourses?.find(
            (c) => c.id == course.id,
          )?.classification;
        }
        return course;
      });
      setOriginalCourses(courses);
      lastFetch.current = new Date();
    };
    code().catch(console.error);
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
    let newCourses = originalCourses.map((originalCourse) => {
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

      if (now < end) {
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
      }

      if (start < now) start.setDate(start.getDate() + 1);
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
      course.time.activePinned = false;

      return course;
    }) as CoursesContextValue;

    let closestTime = Infinity;
    let closestPeriod: CoursesContextValue[0] | undefined;

    for (const period of newCourses) {
      const timeToStart =
        (period.time?.start?.getTime() ?? 0) - new Date().getTime();
      const timeToEnd =
        (period.time?.end?.getTime() ?? 0) - new Date().getTime();
      if (timeToStart > 0 && timeToStart < closestTime) {
        closestTime = timeToStart;
        closestPeriod = period;
      }
      if (timeToEnd > 0 && timeToEnd < closestTime) {
        closestTime = timeToEnd;
        closestPeriod = period;
      }
    }

    if (closestPeriod && closestTime < 1000 * 60 * 60 * 2) {
      newCourses = newCourses.map((period) => {
        if (period.id == closestPeriod.id) {
          return {
            ...period,
            time: {
              ...period.time,
              activePinned: true,
            },
          };
        }
        return period;
      });
    }

    if (
      courses.length == 0 ||
      now.getSeconds() == 0 ||
      unfocused.current == true
    ) {
      unfocused.current = false;
      window.globalDebug.courses = newCourses;
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

function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const now = useContext(TimeContext);
  const [originalSchedule, setOriginalSchedule] = useState<
    SchedulePeriodWithCourse[]
  >([]);
  const [schedule, setSchedule] = useState<ScheduleContextValue>([]);
  const [forceRefresh, setForce] = useState(Math.random());
  const lastFetch = useRef(new Date());
  const unfocused = useRef(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      const req = await fetch("/api/courses/get-with-schedule");
      const { data } = (await req.json()) as {
        success: boolean;
        data: CurrentScheduleWithCoursesOutput;
        errors?: { message: string }[];
      };
      setOriginalSchedule(data?.periods ?? []);
      lastFetch.current = new Date();
    };
    fetchSchedule().catch(console.error);
    const interval = setInterval(() => {
      fetchSchedule().catch(console.error);
    }, 60 * 1000);
    window.addEventListener("focus", () => {
      if (new Date().getTime() - lastFetch.current.getTime() > 30 * 1000) {
        fetchSchedule().catch(console.error);
      }
    });
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", () => {
        unfocused.current = false;
      });
    };
  }, [forceRefresh]);

  useEffect(() => {
    let newSchedule = originalSchedule.map((originalPeriod) => {
      const period = {
        ...originalPeriod,
      } as unknown as ScheduleContextValue[0];
      if (!period.time) {
        period.time = {
          start: undefined,
          end: undefined,
          startTime: "",
          endTime: "",
          active: false,
          activePinned: false,
        };
        return period;
      }
      const start = new Date(
        `${now.toISOString().split("T")[0]}T${period.time?.startTime}Z`,
      );
      const end = new Date(
        `${now.toISOString().split("T")[0]}T${period.time?.endTime}Z`,
      );

      if (now < end) {
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
      }

      if (start < now) start.setDate(start.getDate() + 1);
      if (end < start) end.setDate(end.getDate() + 1);

      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        period.time.start = undefined;
        period.time.end = undefined;
        period.time.active = false;
        period.time.activePinned = false;
        return period;
      }

      const isActive =
        period.time?.start && period.time?.end
          ? start?.getTime() <= now.getTime() && now.getTime() < end?.getTime()
          : false;

      period.time.start = start;
      period.time.end = end;
      period.time.active = isActive;
      period.time.activePinned = false;

      return period;
    }) as ScheduleContextValue;

    let closestTime = Infinity;
    let closestPeriod: ScheduleContextValue[0] | undefined;

    for (const period of newSchedule) {
      const timeToStart =
        (period.time?.start?.getTime() ?? 0) - new Date().getTime();
      const timeToEnd =
        (period.time?.end?.getTime() ?? 0) - new Date().getTime();
      if (timeToStart > 0 && timeToStart < closestTime) {
        closestTime = timeToStart;
        closestPeriod = period;
      }
      if (timeToEnd > 0 && timeToEnd < closestTime) {
        closestTime = timeToEnd;
        closestPeriod = period;
      }
    }

    if (closestPeriod && closestTime < 1000 * 60 * 60 * 2) {
      newSchedule = newSchedule.map((period) => {
        if (period.period.id == closestPeriod.period.id) {
          return {
            ...period,
            time: {
              ...period.time,
              activePinned: true,
            },
          };
        }
        return period;
      });
    }

    if (
      schedule.length == 0 ||
      now.getSeconds() == 0 ||
      unfocused.current == true
    ) {
      unfocused.current = false;
      window.globalDebug.schedule = newSchedule;
      setSchedule(newSchedule);
    }
    window.addEventListener("blur", () => {
      unfocused.current = true;
    });
  }, [now, originalSchedule, schedule.length]);

  return (
    <CoursesRefreshContext.Provider value={setForce}>
      <ScheduleContext.Provider value={schedule}>
        {children}
      </ScheduleContext.Provider>
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

function PubSubProvider({ children }: { children: React.ReactNode }) {
  const [pubSub, setPubSub] = useState<Pusher | null>(null);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_APP_KEY!, {
      wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
      httpHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
      forceTLS: true,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu",
      userAuthentication: {
        endpoint: "/api/catalyst/realtime/auth",
        transport: "ajax",
      },
    });
    pusher.signin();

    setPubSub(pusher);

    return () => {
      pusher.disconnect();
    };
  }, []);

  return (
    <PubSubContext.Provider value={pubSub}>{children}</PubSubContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(PubSubContext);
  if (!context) {
    console.warn(
      "useRealtime is still loading, this may be due to the Pusher connection not being established yet.",
    );
  }
  return context;
}

export function PipProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [pips, setPips] = useState<Record<string, PipItem> | null>(null);

  const [openPip, setOpenPip] = useState<string | null>(
    typeof window != "undefined" ? localStorage.getItem("openPip") : null,
  );

  useEffect(() => {
    localStorage.setItem("openPip", openPip ?? "");
  }, [openPip]);

  useEffect(() => {
    const pip = Object.keys(pipManager).reduce(
      (acc, key) => {
        acc[key] = {
          open: async () => {
            if (!acc[key]!.canOpen()) {
              console.error("Browser does not support Picture-in-Picture");
              return;
            }
            const pip = pipManager[key]!;
            const win = await window.documentPictureInPicture.requestWindow({
              width: pip.window.width,
              height: pip.window.height,
            });
            win.window.name = pip.window.title;
            win.document.title = pip.window.title;
            win.document.body.style.margin = "0";
            win.document.body.style.overflow = "hidden";
            win.document.body.style.background = "black";
            const iframe = win.document.createElement("iframe");
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
            iframe.style.border = "none";
            iframe.src = `/pip/${key}`;
            win.document.body.append(iframe);
            win.addEventListener("message", (e) => {
              const evt = e.data as {
                action: "navigate" | "close";
                url?: string;
              };
              if (evt.action == "navigate" && evt.url) {
                router.push(evt.url);
                window.focus();
              }
              if (evt.action == "close") {
                setOpenPip(null);
              }
            });
            setOpenPip(key);
          },
          close: async () => {
            window.documentPictureInPicture?.window?.close();
          },
          toggle: async () => {
            if (window.documentPictureInPicture?.window) {
              window.documentPictureInPicture?.window?.close();
            } else {
              await acc[key]?.open();
            }
          },
          isOpen: () => {
            const pip = pipManager[key]!;
            return (
              typeof window != "undefined" &&
              window.documentPictureInPicture?.window?.name == pip.window.title
            );
          },
          canOpen: () => {
            return (
              typeof window != "undefined" &&
              !!window.documentPictureInPicture?.requestWindow
            );
          },
        };
        return acc;
      },
      {} as Record<string, PipItem>,
    );
    setPips(pip);
  }, [router, openPip]);

  return <PipContext.Provider value={pips}>{children}</PipContext.Provider>;
}

export function usePip() {
  const context = useContext(PipContext);
  if (!context) {
    console.warn("usePip is still loading");
  }
  return context;
}

export function AppLayoutProviders({
  children,
  courses,
}: {
  children: React.ReactNode;
  courses: CourseListWithPeriodDataOutput;
}) {
  if (typeof window != "undefined") {
    window.globalDebug ??= {};
  }

  return (
    <SessionVerificationProvider>
      <CommandMenuProvider>
        <TimeProvider>
          <CourseProvider courses={courses}>
            <ScheduleProvider>
              <PubSubProvider>
                <PipProvider>{children}</PipProvider>
              </PubSubProvider>
            </ScheduleProvider>
          </CourseProvider>
        </TimeProvider>
      </CommandMenuProvider>
    </SessionVerificationProvider>
  );
}
