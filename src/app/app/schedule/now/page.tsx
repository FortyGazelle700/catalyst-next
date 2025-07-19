"use client";

import { useContext, useMemo } from "react";
import { CoursesContext, TimeContext } from "../../layout.providers";
import { Temporal } from "@js-temporal/polyfill";
import {
  House,
  LayoutDashboard,
  Percent,
  TimerOff,
  UsersRound,
} from "lucide-react";
import { NumberCounter } from "@/components/catalyst/number-counter";
import { formatDuration } from "@/components/catalyst/format-duration";
import Link from "next/link";
import { subjectColors, SubjectIcon } from "@/components/catalyst/subjects";

export default function ScheduleCountdownPage() {
  const now = useContext(TimeContext);
  const courses = useContext(CoursesContext);

  const currentCourse = useMemo(() => {
    return courses?.find((course) => course.time?.activePinned);
  }, [courses]);

  const timeToStart = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentCourse?.time.start?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentCourse],
  );

  const timeLeft = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentCourse?.time.end?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentCourse],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalDuration = useMemo(
    () =>
      Temporal.Instant.from(
        currentCourse?.time.start?.toISOString() ?? now.toISOString(),
      ).until(
        Temporal.Instant.from(
          currentCourse?.time.end?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentCourse],
  );

  const hasStarted = useMemo(
    () => timeToStart.total("milliseconds") <= 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeToStart, currentCourse, now],
  );

  if (!currentCourse) {
    return (
      <div className="flex flex-col items-start gap-2 px-6 pt-10 pb-2">
        <TimerOff className="text-muted-foreground size-8" />
        <div className="text-lg font-bold">No schedule is present</div>
        <p className="text-muted-foreground text-xs">
          You do not have any active schedules at the moment. Please check back
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-12 flex w-[50rem] items-center justify-stretch gap-2 rounded-lg border">
      <div className="flex flex-1 flex-col items-center gap-1 p-2">
        <div>{!hasStarted && "Starts in"}</div>
        <div className="flex items-stretch justify-center overflow-hidden text-7xl font-bold">
          {formatDuration(hasStarted ? timeLeft : timeToStart, {
            style: "digital",
            maxUnit: "hour",
            minUnit: "second",
          })
            .split("")
            .map((char, idx) =>
              !new RegExp("\\d").test(char) ? (
                <span
                  className="min-w-[0.5ch] text-center"
                  key={`time-char-${char}-${idx}`}
                >
                  {char}
                </span>
              ) : (
                <NumberCounter
                  key={`time-idx-${idx}`}
                  value={Number(char)}
                  height={72}
                />
              ),
            )}
        </div>
        <div className="text-muted-foreground text-lg">
          {hasStarted && "remaining"}
        </div>
        <div className="flex w-full items-center justify-between px-6 pt-6 text-lg">
          <span>
            {currentCourse?.time?.start?.toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
          <span>
            {currentCourse?.time?.end?.toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="bg-secondary h-18 w-1 rounded-full" />
      <div className="flex flex-1 flex-col items-center gap-1 p-2">
        <div className="group mb-2 w-full cursor-pointer !bg-transparent p-0">
          <Link href={`/app/courses/${currentCourse?.id}`} className="w-full">
            <div
              className="flex w-full max-w-full flex-col items-start gap-1 overflow-hidden rounded rounded-tr-sm p-2 transition-all group-hover:!bg-[var(--bg)]"
              style={
                {
                  backgroundColor: `color-mix(in oklab, ${subjectColors(
                    currentCourse?.classification ?? "",
                  )}, var(--ui-background))`,
                  "--bg": `color-mix(in oklab, ${subjectColors(
                    currentCourse?.classification ?? "",
                  )}, var(--ui-background) 60%)`,
                } as React.CSSProperties
              }
            >
              <div className="flex items-center gap-1">
                <div
                  className="rounded-full p-1"
                  style={{
                    backgroundColor: `color-mix(in oklab, ${subjectColors(
                      currentCourse?.classification ?? "",
                    )}, var(--ui-background) 30%)`,
                  }}
                >
                  <SubjectIcon
                    subject={currentCourse?.classification ?? ""}
                    className="text-primary size-4"
                  />
                </div>
                <h3 className="h4">{currentCourse?.classification}</h3>
              </div>
              <p className="max-w-full truncate text-xs">
                {currentCourse?.original_name}
              </p>
            </div>
          </Link>
        </div>
        <Link
          href={`/app/courses/${currentCourse?.id}`}
          className="hover:bg-secondary flex w-full items-center gap-2 rounded p-4"
        >
          <House />
          <span>Homepage</span>
        </Link>
        <Link
          href={`/app/courses/${currentCourse?.id}/modules`}
          className="hover:bg-secondary flex w-full items-center gap-2 rounded p-4"
        >
          <LayoutDashboard />
          <span>Modules</span>
        </Link>
        <Link
          href={`/app/courses/${currentCourse?.id}/people`}
          className="hover:bg-secondary flex w-full items-center gap-2 rounded p-4"
        >
          <UsersRound />
          <span>People</span>
        </Link>
        <Link
          href={`/app/courses/${currentCourse?.id}/grades`}
          className="hover:bg-secondary flex w-full items-center gap-2 rounded rounded-br-md p-4"
        >
          <Percent />
          <span>Grades</span>
        </Link>
      </div>
    </div>
  );
}
