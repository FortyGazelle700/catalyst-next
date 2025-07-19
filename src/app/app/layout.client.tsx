"use client";

import { RadialChart } from "@/components/catalyst/radial-chart";
import { RadialCountdown } from "@/components/catalyst/radial-countdown";
import { SubjectIcon, subjectColors } from "@/components/catalyst/subjects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  House,
  LayoutDashboard,
  UsersRound,
  Percent,
  X,
  Clock,
  Timer,
  ChevronRight,
  Bomb,
  TimerOff,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useContext, useMemo } from "react";
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
                    tooltip={`${course.classification} - ${
                      course.original_name
                    } (${course?.period?.periodName ?? "Unassigned"})`}
                    className={cn(
                      "h-12 cursor-pointer rounded-full pr-2",
                      course.time?.active &&
                        "bg-secondary/50 border-primary/20 border",
                    )}
                  >
                    <a>
                      <SubjectIcon subject={course.classification ?? ""} />
                      <div className="flex max-w-full flex-1 flex-col overflow-hidden">
                        <b className="inline-flex items-center gap-2 truncate">
                          <span>{course.classification}</span>
                          <div
                            className={cn(
                              "-ml-5 flex w-0 items-center justify-center gap-1 rounded-full border border-amber-500/50 bg-[color-mix(in_oklab,var(--color-amber-500),var(--ui-background)_70%)] py-0.5 pr-2 pl-1 text-[0.5rem] opacity-0 transition-all",
                              course.time?.activePinned &&
                                !course.time?.active &&
                                "ml-0 w-[calc-size(auto,size)] opacity-100",
                            )}
                          >
                            <div className="size-2 rounded-full bg-amber-500" />
                            <span>Upcoming</span>
                          </div>
                          <div
                            className={cn(
                              "-ml-5 flex w-0 items-center justify-center gap-1 rounded-full border border-green-500/50 bg-[color-mix(in_oklab,var(--color-green-500),var(--ui-background)_70%)] py-0.5 pr-2 pl-1 text-[0.5rem] opacity-0 transition-all",
                              course.time?.active &&
                                "ml-0 w-[calc-size(auto,size)] opacity-100",
                            )}
                          >
                            <div className="size-2 rounded-full bg-green-500" />
                            <span>Active</span>
                          </div>
                          <div
                            className={cn(
                              "flex w-0 items-center justify-center gap-1 rounded-full border border-red-500/50 bg-[color-mix(in_oklab,var(--color-red-500),var(--ui-background)_70%)] py-0.5 pr-2 pl-1 text-[0.5rem] opacity-0 transition-all",
                              course.data.missingAssignments > 0 &&
                                "w-[calc-size(auto,size)] opacity-100",
                            )}
                          >
                            {/* <div className="size-2 bg-red-500 rounded-full" /> */}
                            <Bomb className="size-2 fill-red-500 stroke-red-500" />
                            <span>{course.data.missingAssignments}</span>
                          </div>
                        </b>
                        <span className="text-muted-foreground truncate text-xs">
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
                                    ?.computed_current_score,
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
                    className="group mb-2 w-full cursor-pointer !bg-transparent p-0"
                  >
                    <Link href={`/app/courses/${course.id}`} className="w-full">
                      <div
                        className="flex w-full max-w-full flex-col items-start gap-1 overflow-hidden rounded-t-sm rounded-b p-2 transition-all group-hover:!bg-[var(--bg)]"
                        style={
                          {
                            backgroundColor: `color-mix(in oklab, ${subjectColors(
                              course.classification ?? "",
                            )}, var(--ui-background))`,
                            "--bg": `color-mix(in oklab, ${subjectColors(
                              course.classification ?? "",
                            )}, var(--ui-background) 60%)`,
                          } as React.CSSProperties
                        }
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className="rounded-full p-1"
                            style={{
                              backgroundColor: `color-mix(in oklab, ${subjectColors(
                                course.classification ?? "",
                              )}, var(--ui-background) 30%)`,
                            }}
                          >
                            <SubjectIcon
                              subject={course.classification ?? ""}
                              className="text-primary size-4"
                            />
                          </div>
                          <h3 className="h4">{course.classification}</h3>
                        </div>
                        <p className="max-w-full truncate text-xs">
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
                  <div className="bg-secondary mx-4 my-1 h-0.5 rounded-full" />
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
    [currentCourse, now, timeToStart],
  );

  if (!currentCourse) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer pr-3 pl-1"
            tooltip={`${formatDuration(hasStarted ? timeLeft : timeToStart, {
              style: "digital",
              maxUnit: "hour",
              minUnit: "second",
            })} - Schedule`}
          >
            <RadialCountdown
              percentage={100}
              className="bg-background fill-foreground rounded-full opacity-20 transition-all group-data-[collapsible=icon]:-ml-2"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="inline-flex items-center truncate font-semibold">
                Schedule
              </span>
              <span className="text-muted-foreground truncate text-xs">
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
          <div className="flex flex-col items-start gap-2 px-6 pt-10 pb-2">
            <TimerOff className="text-muted-foreground size-8" />
            <div className="text-lg font-bold">No schedule is present</div>
            <p className="text-muted-foreground text-xs">
              You do not have any active schedules at the moment. Please check
              back later.
            </p>
          </div>
          <div className="bg-secondary mx-4 my-1 h-0.5 rounded-full" />
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
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer pr-3 pl-1"
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
              "bg-background fill-foreground rounded-full transition-all group-data-[collapsible=icon]:-ml-2",
              !hasStarted ? "opacity-20" : "opacity-100",
            )}
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="inline-flex items-center truncate font-semibold">
              <span
                className={cn(
                  "mr-0 overflow-hidden transition-all",
                  hasStarted ? "w-0" : "mr-[0.3ch] w-[6ch]",
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
                  ),
                )}
              <span
                className={cn(
                  "ml-[0.3ch] overflow-hidden transition-all",
                  !hasStarted ? "w-0" : "w-[10ch]",
                )}
              >
                {" "}
                left
              </span>
            </span>
            <span className="text-muted-foreground truncate text-xs">
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
          className="group mb-2 w-full cursor-pointer !bg-transparent p-0"
        >
          <Link href={`/app/courses/${currentCourse?.id}`} className="w-full">
            <div
              className="flex w-full max-w-full flex-col items-start gap-1 overflow-hidden rounded-t-sm rounded-b p-2 transition-all group-hover:!bg-[var(--bg)]"
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
        <div className="text-muted-foreground bg-secondary my-1 flex flex-col gap-1 rounded p-2 pl-8 text-xs">
          <div className="flex items-center overflow-hidden">
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
                ),
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
        <div className="bg-secondary mx-4 my-1 h-0.5 rounded-full" />
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
