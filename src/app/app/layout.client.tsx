"use client";

import { RadialChart } from "@/components/catalyst/radial-chart";
import { RadialCountdown } from "@/components/catalyst/radial-countdown";
import { SubjectIcon, subjectColors } from "@/components/catalyst/subjects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { CourseListWithPeriodDataOutput } from "@/server/api/canvas/courses/list-with-period-data";
import {
  House,
  LayoutDashboard,
  UsersRound,
  Percent,
  X,
  Clock,
  Timer,
  ChevronRight,
  NotepadTextDashed,
  Bomb,
  TimerOff,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CoursesContext, TimeContext } from "./layout.providers";
import { Temporal } from "@js-temporal/polyfill";
import { NumberCounter } from "@/components/catalyst/number-counter";
import { signOut } from "next-auth/react";
import { formatDuration } from "@/components/catalyst/format-duration";

export function CoursesGroupClient() {
  const courses = useContext(CoursesContext);

  return (
    <>
      {courses
        ?.filter((_, idx) => idx < 10)
        ?.map((course) => {
          return (
            <DropdownMenu key={course.id}>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    tooltip={`${course.classification} - ${course.original_name
                      } (${course?.period?.periodName ?? "Unassigned"})`}
                    className={cn(
                      "h-12 cursor-pointer rounded-full pr-2",
                      course.time?.active &&
                      "bg-secondary/50 border border-primary/20"
                    )}
                  >
                    <a>
                      <SubjectIcon subject={course.classification ?? ""} />
                      <div className="flex flex-col max-w-full overflow-hidden flex-1">
                        <b className="inline-flex items-center gap-2 truncate">
                          <span>{course.classification}</span>
                          <div
                            className={cn(
                              "text-[0.5rem] pl-1 pr-2 py-0.5 border border-amber-500/50 bg-[color-mix(in_oklab,var(--color-amber-500),var(--ui-background)_70%)] rounded-full flex items-center justify-center gap-1 opacity-0 transition-all w-0 -ml-5",
                              course.time?.activePinned &&
                              !course.time?.active &&
                              "opacity-100  w-[calc-size(auto,size)] ml-0"
                            )}
                          >
                            <div className="size-2 bg-amber-500 rounded-full" />
                            <span>Upcoming</span>
                          </div>
                          <div
                            className={cn(
                              "text-[0.5rem] pl-1 pr-2 py-0.5 border border-green-500/50 bg-[color-mix(in_oklab,var(--color-green-500),var(--ui-background)_70%)] rounded-full flex items-center justify-center gap-1 opacity-0 transition-all w-0 -ml-5",
                              course.time?.active &&
                              "opacity-100  w-[calc-size(auto,size)] ml-0"
                            )}
                          >
                            <div className="size-2 bg-green-500 rounded-full" />
                            <span>Active</span>
                          </div>
                          <div
                            className={cn(
                              "text-[0.5rem] pl-1 pr-2 py-0.5 border border-red-500/50 bg-[color-mix(in_oklab,var(--color-red-500),var(--ui-background)_70%)] rounded-full flex items-center justify-center gap-1 opacity-0 transition-all w-0",
                              course.data.missingAssignments > 0 &&
                              "opacity-100 w-[calc-size(auto,size)]"
                            )}
                          >
                            {/* <div className="size-2 bg-red-500 rounded-full" /> */}
                            <Bomb className="size-2 stroke-red-500 fill-red-500" />
                            <span>{course.data.missingAssignments}</span>
                          </div>
                        </b>
                        <span className="text-xs text-muted-foreground truncate">
                          {course?.period?.periodName ?? "Unassigned"} -{" "}
                          {course.original_name}
                        </span>
                      </div>
                      <div className="bg-background rounded-full">
                        <RadialChart
                          percentage={
                            course.enrollments?.at(0)?.computed_current_score
                              ? Number(
                                course.enrollments?.at(0)
                                  ?.computed_current_score
                              )
                              : -1
                          }
                        />
                      </div>
                    </a>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  className="w-[20ch]"
                >
                  <DropdownMenuItem
                    asChild
                    className="p-0 !bg-transparent cursor-pointer group mb-2 w-full"
                  >
                    <Link href={`/app/courses/${course.id}`} className="w-full">
                      <div
                        className="rounded-t-sm rounded-b p-2 flex flex-col items-start max-w-full overflow-hidden gap-1 group-hover:!bg-[var(--bg)] transition-all w-full"
                        style={
                          {
                            backgroundColor: `color-mix(in oklab, ${subjectColors(
                              course.classification ?? ""
                            )}, var(--ui-background))`,
                            "--bg": `color-mix(in oklab, ${subjectColors(
                              course.classification ?? ""
                            )}, var(--ui-background) 60%)`,
                          } as React.CSSProperties
                        }
                      >
                        <div className="flex gap-1 items-center">
                          <div
                            className="rounded-full p-1"
                            style={{
                              backgroundColor: `color-mix(in oklab, ${subjectColors(
                                course.classification ?? ""
                              )}, var(--ui-background) 30%)`,
                            }}
                          >
                            <SubjectIcon
                              subject={course.classification ?? ""}
                              className="size-4 text-primary"
                            />
                          </div>
                          <h3 className="h4">{course.classification}</h3>
                        </div>
                        <p className="text-xs truncate max-w-full">
                          {course.original_name}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/app/courses/${course.id}`}>
                      <House />
                      <span>Homepage</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/app/courses/${course.id}/modules`}>
                      <LayoutDashboard />
                      <span>Modules</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/app/courses/${course.id}/people`}>
                      <UsersRound />
                      <span>People</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/app/courses/${course.id}/grades`}>
                      <Percent />
                      <span>Grades</span>
                    </Link>
                  </DropdownMenuItem>
                  <div className="h-0.5 rounded-full bg-secondary my-1 mx-4" />
                  <DropdownMenuItem asChild>
                    <a>
                      <X />
                      <span>Close</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </SidebarMenuItem>
            </DropdownMenu>
          );
        })}
    </>
  );
}

export function ScheduleWidget() {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pl-1 pr-3 cursor-pointer"
            tooltip={`${formatDuration(hasStarted ? timeLeft : timeToStart, {
              style: "digital",
              maxUnit: "hour",
              minUnit: "second",
            })} - Schedule`}
          >
            <RadialCountdown
              percentage={100}
              className="group-data-[collapsible=icon]:-ml-2 bg-background rounded-full opacity-20 fill-foreground transition-all"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold inline-flex items-center">
                Schedule
              </span>
              <span className="truncate text-xs text-muted-foreground">
                No schedule is active
              </span>
            </div>
            <ChevronRight className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[18rem] min-w-56 rounded-lg"
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <div className="px-6 pt-10 pb-2 flex flex-col gap-2 items-start">
            <TimerOff className="text-muted-foreground size-8" />
            <div className="font-bold text-lg">No schedule is present</div>
            <p className="text-xs text-muted-foreground">
              You do not have any active schedules at the moment. Please check
              back later.
            </p>
          </div>
          <div className="h-0.5 rounded-full bg-secondary my-1 mx-4" />
          <DropdownMenuItem asChild>
            <a>
              <X />
              <span>Close</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pl-1 pr-3 cursor-pointer"
          tooltip={`${formatDuration(hasStarted ? timeLeft : timeToStart, {
            style: "digital",
            maxUnit: "hour",
            minUnit: "second",
          })} - Schedule`}
        >
          <RadialCountdown
            percentage={
              (timeLeft.total("milliseconds") /
                totalDuration.total("milliseconds")) *
              100
            }
            className={cn(
              "group-data-[collapsible=icon]:-ml-2 bg-background rounded-full fill-foreground transition-all",
              !hasStarted ? "opacity-20" : "opacity-100"
            )}
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold inline-flex items-center">
              <span
                className={cn(
                  "mr-0 overflow-hidden transition-all",
                  hasStarted ? "w-0" : "w-[6ch] mr-[0.3ch]"
                )}
              >
                Starts in{" "}
              </span>
              {formatDuration(hasStarted ? timeLeft : timeToStart, {
                style: "long",
                maxUnits: 1,
                maxUnit: "hour",
                minUnit: "second",
              })
                .split("")
                .map((char, idx) =>
                  !new RegExp("\\d").test(char) ? (
                    <span
                      className="min-w-[0.3ch] text-center"
                      key={`time-char-${char}-${idx}`}
                    >
                      {char}
                    </span>
                  ) : (
                    <NumberCounter
                      key={`time-idx-${idx}`}
                      value={Number(char)}
                      height={12}
                    />
                  )
                )}
              <span
                className={cn(
                  "ml-[0.3ch] overflow-hidden transition-all",
                  !hasStarted ? "w-0" : "w-[10ch]"
                )}
              >
                {" "}
                left
              </span>
            </span>
            <span className="truncate text-xs text-muted-foreground">
              in {currentCourse?.classification ?? "No Class"} (
              {currentCourse?.original_name ?? "No Class"})
            </span>
          </div>
          <ChevronRight className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[18rem] min-w-56 rounded-lg"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuItem
          asChild
          className="p-0 !bg-transparent cursor-pointer group mb-2 w-full"
        >
          <Link href={`/app/courses/${currentCourse?.id}`} className="w-full">
            <div
              className="rounded-t-sm rounded-b p-2 flex flex-col items-start max-w-full overflow-hidden gap-1 group-hover:!bg-[var(--bg)] transition-all w-full"
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
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/app/courses/${currentCourse?.id}`}>
            <House />
            <span>Homepage</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/app/courses/${currentCourse?.id}/modules`}>
            <LayoutDashboard />
            <span>Modules</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/app/courses/${currentCourse?.id}/people`}>
            <UsersRound />
            <span>People</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/app/courses/${currentCourse?.id}/grades`}>
            <Percent />
            <span>Grades</span>
          </Link>
        </DropdownMenuItem>
        <div className="pl-8 text-xs text-muted-foreground bg-secondary p-2 rounded my-1 gap-1 flex flex-col">
          <div className="overflow-hidden flex items-center">
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
                    height={14}
                  />
                )
              )}
            <span className="ml-[0.3ch]"> remaining</span>
          </div>
          <div className="flex items-center justify-between">
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
        <DropdownMenuItem asChild>
          <Link href="/app/schedule/now">
            <Timer />
            <span>View in Fullscreen</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/app/schedule">
            <Clock />
            <span>Open Full Schedule</span>
          </Link>
        </DropdownMenuItem>
        <div className="h-0.5 rounded-full bg-secondary my-1 mx-4" />
        <DropdownMenuItem asChild>
          <a>
            <X />
            <span>Close</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SignOut() {
  return (
    <DropdownMenuItem onClick={() => signOut()}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
}
