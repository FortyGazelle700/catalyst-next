"use client";

import { useContext, useMemo } from "react";
import {
  CoursesContext,
  ScheduleContext,
  TimeContext,
  usePip,
} from "../../layout.providers";
import { Temporal } from "@js-temporal/polyfill";
import {
  House,
  LayoutDashboard,
  List,
  Percent,
  PictureInPicture2,
  TimerOff,
  UsersRound,
  X,
} from "lucide-react";
import { NumberCounter } from "@/components/catalyst/number-counter";
import { formatDuration } from "@/components/catalyst/format-duration";
import Link from "next/link";
import { subjectColors, SubjectIcon } from "@/components/catalyst/subjects";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function ScheduleCountdownPage() {
  const now = useContext(TimeContext);
  const courses = useContext(CoursesContext);
  const schedule = useContext(ScheduleContext);
  const pip = usePip();

  const currentPeriod = useMemo(() => {
    return schedule?.find((period) => period.time?.activePinned);
  }, [schedule]);

  const currentCourse = useMemo(() => {
    return courses?.find((course) => course.time?.activePinned);
  }, [courses]);

  const timeToStart = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentPeriod?.time.start?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentPeriod],
  );

  const timeLeft = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentPeriod?.time.end?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentPeriod],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalDuration = useMemo(
    () =>
      Temporal.Instant.from(
        currentPeriod?.time.start?.toISOString() ?? now.toISOString(),
      ).until(
        Temporal.Instant.from(
          currentPeriod?.time.end?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentPeriod],
  );

  const hasStarted = useMemo(
    () => timeToStart.total("milliseconds") <= 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeToStart, currentPeriod, now],
  );

  if (!currentPeriod) {
    return (
      <div className="@container-size flex h-full w-full flex-1 flex-col items-center justify-center gap-1 p-2">
        <div className="flex flex-row items-center gap-2 px-6">
          <TimerOff className="text-muted-foreground size-8 shrink-0" />
          <div className="flex flex-col gap-1">
            <div className="text-lg font-bold">No schedule is present</div>
            <p className="text-muted-foreground text-xs">
              You do not have any active schedules at the moment. Please check
              back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="mx-auto my-12 flex w-[calc(100%-theme(spacing.8))] flex-col items-stretch justify-stretch gap-2 rounded-lg border @4xl:w-[50rem] @4xl:flex-row">
        <div className="relative flex flex-1 flex-col items-center justify-center gap-1 p-2 pb-16 @4xl:pb-2">
          <div>
            {!hasStarted && `${currentPeriod?.period?.periodName} starts in`}
          </div>
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
            {hasStarted && `remaining in ${currentPeriod?.period?.periodName}`}
          </div>
          <div className="flex w-full items-center justify-between px-6 pt-6 text-lg">
            <span>
              {currentPeriod?.time?.start?.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
            <span>
              {currentPeriod?.time?.end?.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                if (pip?.schedule?.isOpen()) {
                  await pip?.schedule?.close();
                } else {
                  await pip?.schedule?.open();
                }
              }}
              disabled={!pip?.schedule?.canOpen()}
              className={cn(!pip?.schedule?.canOpen() && "relative opacity-50")}
            >
              {pip?.schedule?.isOpen() ? <X /> : <PictureInPicture2 />}
              {!pip?.schedule?.canOpen() && (
                <Tooltip>
                  <TooltipTrigger className="absolute inset-0" asChild>
                    <div />
                  </TooltipTrigger>
                  <TooltipContent>
                    Mini Mode is not available on this device / browser.
                  </TooltipContent>
                </Tooltip>
              )}
            </Button>
            <Button variant="outline" size="icon">
              <List />
            </Button>
          </div>
        </div>
        <div className="bg-secondary my-auto hidden h-18 w-1 rounded-full @4xl:flex" />
        <div className="flex w-full flex-1 flex-col items-center gap-1 p-2 @4xl:w-auto">
          <div className="group mb-2 w-full cursor-pointer !bg-transparent p-0">
            <Link href={`/app/courses/${currentCourse?.id}`} className="w-full">
              <div
                className="mt-8 flex w-full max-w-full flex-col items-start gap-1 overflow-hidden rounded p-2 pt-8 transition-all group-hover:!bg-[var(--bg)] @4xl:mt-0 @4xl:rounded-tr-sm @4xl:pt-2"
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
                      className="text-foreground size-4"
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
    </div>
  );
}
