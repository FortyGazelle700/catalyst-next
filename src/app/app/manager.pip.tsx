"use client";

import { useContext, useMemo, useRef } from "react";
import { CoursesContext, TimeContext } from "./layout.providers";
import { Temporal } from "@js-temporal/polyfill";
import {
  House,
  LayoutDashboard,
  Percent,
  TimerOff,
  UsersRound,
} from "lucide-react";
import { formatDuration } from "@/components/catalyst/format-duration";
import { NumberCounter } from "@/components/catalyst/number-counter";
import { useTailwindContainerBreakpoints } from "@/components/util/hooks";
import Link from "next/link";
import { subjectColors, SubjectIcon } from "@/components/catalyst/subjects";
import { cn } from "@/lib/utils";

export const pipManager = {
  schedule: {
    window: {
      width: 200,
      height: 200,
      title: "Schedule",
    },
    Render: () => {
      const now = useContext(TimeContext);
      const courses = useContext(CoursesContext);

      const container = useRef<HTMLDivElement>(null);

      const wQuery = useTailwindContainerBreakpoints({
        breakpoint: 20,
        ref: container,
        reverse: true,
        forceUpdates: true,
      });

      const hQuery = useTailwindContainerBreakpoints({
        breakpoint: 8,
        ref: container,
        useHeight: true,
        reverse: true,
        forceUpdates: true,
      });

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
          <div
            className="@container-size flex h-full w-full flex-1 flex-col items-center justify-center gap-1 p-2"
            ref={container}
          >
            <div className="@short:flex-col @short:items-center flex flex-row items-start gap-2 px-6">
              <TimerOff className="text-muted-foreground size-8 shrink-0" />
              <div className="flex flex-col gap-1">
                <div className="text-lg font-bold">No schedule is present</div>
                <p className="text-muted-foreground @xshort:flex hidden text-xs">
                  You do not have any active schedules at the moment. Please
                  check back later.
                </p>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div
          className="@container-size flex h-full w-full flex-1 flex-col items-center justify-center gap-1 p-2"
          ref={container}
        >
          <div
            className={cn(
              "mx-auto my-12 flex w-[calc(100%-theme(spacing.8))] flex-row items-center justify-stretch gap-2",
              "[@container_(width<=56rem)_and_(height>=16rem)]:flex-col",
            )}
          >
            <div
              className={cn(
                "flex flex-1 flex-col items-center gap-1 p-2",
                "[@container_(height<=6rem)]:flex-row [@container_(height<=8rem)]:justify-between",
              )}
            >
              {!hasStarted && <div>Starts in</div>}
              {hasStarted && <div>Time remaining:</div>}
              <div
                className={cn(
                  "flex items-stretch justify-center overflow-hidden text-7xl font-bold",
                  "[@container_(height<=8rem)]:text-2xl",
                  "[@container_(width<=20rem)]:text-2xl",
                )}
              >
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
                        height={hQuery || wQuery ? 28 : 86}
                      />
                    ),
                  )}
              </div>
              <div
                className={cn(
                  "flex w-full items-center justify-between px-6 pt-6 text-lg",
                  "[@container_(width<=56rem)_and_(height<=16rem)]:hidden",
                  "[@container_(width>56rem)_and_(height<=12rem)]:hidden",
                  "[@container_(width<=20rem)]:hidden",
                )}
              >
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
            <div
              className={cn(
                "bg-secondary flex h-18 w-1 rounded-full",
                "[@container_(width<=56rem)]:hidden",
                "[@container_(height<=6rem)]:hidden",
              )}
            />
            <div
              className={cn(
                "flex w-full flex-1 flex-col items-center gap-1 p-2",
                "[@container_(width<=56rem)_and_(height<=20rem)]:hidden",
                "[@container_(height<=6rem)]:hidden",
              )}
            >
              <div className="group mb-2 w-full cursor-pointer !bg-transparent p-0">
                <Link
                  href={`/app/courses/${currentCourse?.id}`}
                  className="w-full"
                >
                  <div
                    className="flex w-full max-w-full flex-col items-start gap-1 overflow-hidden rounded p-2 pt-8 transition-all group-hover:!bg-[var(--bg)]"
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
                onClick={async (evt) => {
                  evt.preventDefault();
                  window.parent?.postMessage(
                    {
                      action: "navigate",
                      url: evt.currentTarget.href,
                    },
                    "*",
                  );
                }}
                className={cn(
                  "hover:bg-secondary flex w-full items-center gap-2 rounded p-4",
                  "[@container_(width<=56rem)_and_(height<=28rem)]:hidden",
                  "[@container_(width>56rem)_and_(height<=16rem)]:hidden",
                )}
              >
                <House />
                <span>Homepage</span>
              </Link>
              <Link
                href={`/app/courses/${currentCourse?.id}/modules`}
                onClick={async (evt) => {
                  evt.preventDefault();
                  window.parent?.postMessage(
                    {
                      action: "navigate",
                      url: evt.currentTarget.href,
                    },
                    "*",
                  );
                }}
                className={cn(
                  "hover:bg-secondary flex w-full items-center gap-2 rounded p-4",
                  "[@container_(width<=56rem)_and_(height<=24rem)]:hidden",
                  "[@container_(width>56rem)_and_(height<=12rem)]:hidden",
                )}
              >
                <LayoutDashboard />
                <span>Modules</span>
              </Link>
              <Link
                href={`/app/courses/${currentCourse?.id}/people`}
                onClick={async (evt) => {
                  evt.preventDefault();
                  window.parent?.postMessage(
                    {
                      action: "navigate",
                      url: evt.currentTarget.href,
                    },
                    "*",
                  );
                }}
                className={cn(
                  "hover:bg-secondary flex w-full items-center gap-2 rounded p-4",
                  "[@container_(width<=56rem)_and_(height<=32rem)]:hidden",
                  "[@container_(width>56rem)_and_(height<=20rem)]:hidden",
                )}
              >
                <UsersRound />
                <span>People</span>
              </Link>
              <a
                href={`/app/courses/${currentCourse?.id}/grades`}
                onClick={async (evt) => {
                  evt.preventDefault();
                  window.parent?.postMessage(
                    {
                      action: "navigate",
                      url: evt.currentTarget.href,
                    },
                    "*",
                  );
                }}
                className={cn(
                  "hover:bg-secondary flex w-full items-center gap-2 rounded p-4",
                  "[@container_(width<=56rem)_and_(height<=36rem)]:hidden",
                  "[@container_(width>56rem)_and_(height<=24rem)]:hidden",
                )}
              >
                <Percent />
                <span>Grades</span>
              </a>
            </div>
          </div>
        </div>
      );
    },
  },
} as Record<
  string,
  {
    window: {
      width: number;
      height: number;
      title: string;
    };
    Render: () => React.ReactNode;
  }
>;
