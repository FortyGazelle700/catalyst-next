"use client";

import { useContext, useEffect, useMemo } from "react";
import { CoursesContext, TimeContext } from "../../layout.providers";
import { Temporal } from "@js-temporal/polyfill";
import { House, LayoutDashboard, Percent, TimerOff, UsersRound } from "lucide-react";
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
          currentCourse?.time.start?.toISOString() ?? now.toISOString()
        ),
        { largestUnit: "hour", smallestUnit: "seconds" }
      ),
    [now, currentCourse]
  );

  const timeLeft = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentCourse?.time.end?.toISOString() ?? now.toISOString()
        ),
        { largestUnit: "hour", smallestUnit: "seconds" }
      ),
    [now, currentCourse]
  );

  const totalDuration = useMemo(
    () =>
      Temporal.Instant.from(
        currentCourse?.time.start?.toISOString() ?? now.toISOString()
      ).until(
        Temporal.Instant.from(
          currentCourse?.time.end?.toISOString() ?? now.toISOString()
        ),
        { largestUnit: "hour", smallestUnit: "seconds" }
      ),
    [currentCourse]
  );

  const hasStarted = useMemo(
    () => timeToStart.total("milliseconds") <= 0,
    [currentCourse, now]
  );

  useEffect(() => {
    console.log("propagate", courses, currentCourse);
  }, [currentCourse]);

  if (!currentCourse) {
    return (
      <div className="px-6 pt-10 pb-2 flex flex-col gap-2 items-start">
        <TimerOff className="text-muted-foreground size-8" />
        <div className="font-bold text-lg">No schedule is present</div>
        <p className="text-xs text-muted-foreground">
          You do not have any active schedules at the moment. Please check
          back later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center justify-stretch rounded-lg border w-[50rem] mx-auto my-12">
      <div className="p-2 gap-1 flex flex-col flex-1 items-center">
        <div>
          {!hasStarted && "Starts in"}
        </div>
        <div className="overflow-hidden flex justify-center text-7xl font-bold items-stretch">
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
              )
            )}
        </div>
        <div className="text-muted-foreground text-lg">
          {hasStarted && "remaining"}
        </div>
        <div className="flex items-center justify-between text-lg w-full px-6 pt-6">
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
      <div className="h-18 bg-secondary rounded-full w-1" />
      <div className="p-2 gap-1 flex flex-col flex-1 items-center">
        <div
          className="p-0 !bg-transparent cursor-pointer group mb-2 w-full"
        >
          <Link href={`/app/courses/${currentCourse?.id}`} className="w-full">
            <div
              className="rounded rounded-tr-sm p-2 flex flex-col items-start max-w-full overflow-hidden gap-1 group-hover:!bg-[var(--bg)] transition-all w-full"
              style={
                {
                  backgroundColor: `color-mix(in oklab, ${subjectColors(
                    currentCourse?.classification ?? ""
                  )}, var(--ui-background))`,
                  "--bg": `color-mix(in oklab, ${subjectColors(
                    currentCourse?.classification ?? ""
                  )}, var(--ui-background) 60%)`,
                } as React.CSSProperties
              }
            >
              <div className="flex gap-1 items-center">
                <div
                  className="rounded-full p-1"
                  style={{
                    backgroundColor: `color-mix(in oklab, ${subjectColors(
                      currentCourse?.classification ?? ""
                    )}, var(--ui-background) 30%)`,
                  }}
                >
                  <SubjectIcon
                    subject={currentCourse?.classification ?? ""}
                    className="size-4 text-primary"
                  />
                </div>
                <h3 className="h4">{currentCourse?.classification}</h3>
              </div>
              <p className="text-xs truncate max-w-full">
                {currentCourse?.original_name}
              </p>
            </div>
          </Link>
        </div>
        <Link href={`/app/courses/${currentCourse?.id}`} className="flex items-center gap-2 hover:bg-secondary w-full p-4 rounded">
          <House />
          <span>Homepage</span>
        </Link>
        <Link href={`/app/courses/${currentCourse?.id}/modules`} className="flex items-center gap-2 hover:bg-secondary w-full p-4 rounded">
          <LayoutDashboard />
          <span>Modules</span>
        </Link>
        <Link href={`/app/courses/${currentCourse?.id}/people`} className="flex items-center gap-2 hover:bg-secondary w-full p-4 rounded">
          <UsersRound />
          <span>People</span>
        </Link>
        <Link href={`/app/courses/${currentCourse?.id}/grades`} className="flex items-center gap-2 hover:bg-secondary w-full p-4 rounded rounded-br-md">
          <Percent />
          <span>Grades</span>
        </Link>
      </div>
    </div>
  );
}