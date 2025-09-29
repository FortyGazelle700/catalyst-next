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
import {
  Sidebar,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
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
  FlaskConical,
  BookMarked,
  UserCircle,
  Bell,
  Check,
  ChevronsUpDown,
  Construction,
  DiamondPlus,
  DoorOpen,
  Logs,
  Megaphone,
  MessageCircle,
  Moon,
  Pencil,
  Plus,
  School,
  Search,
  Settings,
  PictureInPicture2,
  ClockAlert,
  Command,
} from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  CoursesContext,
  ScheduleContext,
  TimeContext,
  usePip,
} from "./layout.providers";
import { Temporal } from "@js-temporal/polyfill";
import { NumberCounter } from "@/components/catalyst/number-counter";
import { signOut } from "next-auth/react";
import { formatDuration } from "@/components/catalyst/format-duration";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@/components/catalyst/accordion";
import { LinkModal } from "@/components/catalyst/link-modal";
import { Breadcrumbs } from "./breadcrumbs";
import { OpenCommandMenu } from "./command-menu";
import FeedbackModalPage from "./feedback/page.modal";
import CreateTodoItemModalPage from "./todo/create/page.modal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Cookies from "universal-cookie";
import type { ApiCtx } from "@/server/api";
import type { Session } from "next-auth";
import SettingsModalPage from "./settings/page.modal";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const navItems = [
    {
      href: "/app",
      icon: FlaskConical,
      label: "Catalyst",
      isActive: pathname === "/app",
    },
    {
      href: "/app/courses",
      icon: BookMarked,
      label: "Courses",
      isActive: pathname.startsWith("/app/courses"),
      isDrawer: true,
      drawerContent: <CoursesMobileClient />,
    },
    {
      href: "/app/social",
      icon: UsersRound,
      label: "Social",
      isActive: pathname.startsWith("/app/social"),
    },
    {
      href: "/app/settings",
      icon: UserCircle,
      label: "You",
      isActive: pathname.startsWith("/app/settings"),
    },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="2xs:h-16 mb-6 flex h-10 md:hidden">
      {navItems.map((item, index) =>
        item.isDrawer ? (
          <Drawer
            key={index}
            open={open && idx === index}
            onOpenChange={() => {
              setOpen(!open);
              setIdx(index);
            }}
          >
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="group flex h-auto flex-1 flex-col items-center justify-center gap-1 !bg-transparent p-0"
              >
                <div
                  className={cn(
                    "group-hover:bg-secondary relative flex size-8 items-center justify-center rounded-lg transition-all group-hover:w-16",
                    item.isActive &&
                      "bg-primary text-primary-foreground group-hover:bg-primary/70 w-12",
                  )}
                >
                  <item.icon className="size-4" />
                </div>
                <span className="text-primary/60 2xs:flex hidden">
                  {item.label}
                </span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{item.label}</DrawerTitle>
              </DrawerHeader>
              <div>{item.drawerContent}</div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Button
            key={index}
            variant="ghost"
            href={item.href}
            className="group flex h-auto flex-1 flex-col items-center justify-center gap-1 !bg-transparent p-0"
          >
            <div
              className={cn(
                "group-hover:bg-secondary relative flex size-8 items-center justify-center rounded-lg transition-all group-hover:w-16",
                item.isActive &&
                  "bg-primary text-primary-foreground group-hover:bg-primary/70 w-12",
              )}
            >
              <item.icon className="size-4" />
            </div>
            <span className="text-primary/60 2xs:flex hidden">
              {item.label}
            </span>
          </Button>
        ),
      )}
    </div>
  );
}

export function CoursesMobileClient() {
  const courses = useContext(CoursesContext);

  return (
    <>
      {courses
        ?.filter((_, idx) => idx < 10)
        ?.map((course, idx) => {
          return (
            <div
              key={course.id}
              className={cn(
                "flex flex-col gap-2 p-4",
                idx != 0 && "border-t",
                course.time?.active &&
                  "bg-secondary/50 border-primary/20 border",
              )}
            >
              <Button
                href={`/app/courses/${course.id}`}
                variant="ghost"
                className="flex h-auto flex-row items-center gap-2"
              >
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
                            course.enrollments?.at(0)?.computed_current_score,
                          )
                        : -1
                    }
                  />
                </div>
              </Button>
              <div className="flex items-center justify-around">
                <Button
                  href={`/app/courses/${course.id}`}
                  variant="ghost"
                  className="w-[14ch]"
                >
                  <House />
                  <span className="hidden sm:flex">Homepage</span>
                </Button>

                <Button
                  href={`/app/courses/${course.id}/modules`}
                  variant="ghost"
                  className="w-[14ch]"
                >
                  <LayoutDashboard />
                  <span className="hidden sm:flex">Modules</span>
                </Button>

                <Button
                  href={`/app/courses/${course.id}/people`}
                  variant="ghost"
                  className="w-[14ch]"
                >
                  <UsersRound />
                  <span className="hidden sm:flex">People</span>
                </Button>

                <Button
                  href={`/app/courses/${course.id}/grades`}
                  variant="ghost"
                  className="w-[14ch]"
                >
                  <Percent />
                  <span className="hidden sm:flex">Grades</span>
                </Button>
              </div>
            </div>
          );
        })}
    </>
  );
}

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
                              "flex w-0 items-center justify-center gap-1 rounded-full border border-red-500/50 bg-[color-mix(in_oklab,var(--color-red-500),var(--ui-background)_80%)] py-0.5 pr-2 pl-1 text-[0.4rem] opacity-0 transition-all",
                              course.data.missingAssignments > 0 &&
                                "w-[calc-size(auto,size)] opacity-100",
                            )}
                          >
                            <ClockAlert className="size-3" />
                            <span>
                              {course.data.missingAssignments} missing
                            </span>
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
                              className="text-foreground size-4"
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
  const schedule = useContext(ScheduleContext);

  const pip = usePip();

  const currentCourse = useMemo(() => {
    return courses?.find((course) => course.time?.activePinned);
  }, [courses]);

  const currentPeriod = useMemo(() => {
    return schedule?.find((period) => period.time?.activePinned);
  }, [schedule]);

  const periodTimeToStart = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentPeriod?.time.start?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentPeriod],
  );

  const periodTimeLeft = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentPeriod?.time.end?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentPeriod],
  );

  const periodTotalDuration = useMemo(
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

  const periodHasStarted = useMemo(
    () => periodTimeToStart.total("milliseconds") <= 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPeriod, now, periodTimeToStart],
  );

  const courseTimeToStart = useMemo(
    () =>
      Temporal.Instant.from(now.toISOString()).until(
        Temporal.Instant.from(
          currentCourse?.time.start?.toISOString() ?? now.toISOString(),
        ),
        { largestUnit: "hour", smallestUnit: "seconds" },
      ),
    [now, currentCourse],
  );

  const courseTimeLeft = useMemo(
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
  const _courseTotalDuration = useMemo(
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

  const courseHasStarted = useMemo(
    () => courseTimeToStart.total("milliseconds") <= 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCourse, now, courseTimeToStart],
  );

  if (!currentPeriod) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer pr-3 pl-1"
            tooltip={`${formatDuration(
              periodHasStarted ? periodTimeLeft : periodTimeToStart,
              {
                style: "digital",
                maxUnit: "hour",
                minUnit: "second",
              },
            )} - Schedule`}
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
            <Link href="/app/schedule/now">
              <Timer />
              <span>View in Fullscreen</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              onClick={async () => {
                if (pip?.schedule?.isOpen()) {
                  await pip?.schedule?.close();
                } else {
                  await pip?.schedule?.open();
                }
              }}
            >
              {pip?.schedule?.isOpen() ? (
                <>
                  <DoorOpen />
                  <span>Close Mini Mode</span>
                </>
              ) : (
                <>
                  <PictureInPicture2 />
                  <span>Open Mini Mode</span>
                </>
              )}
            </a>
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer pr-3 pl-1"
          tooltip={`${formatDuration(
            periodHasStarted ? periodTimeLeft : periodTimeToStart,
            {
              style: "digital",
              maxUnit: "hour",
              minUnit: "second",
            },
          )} - Schedule`}
        >
          <RadialCountdown
            percentage={
              periodHasStarted
                ? (periodTimeLeft.total("milliseconds") /
                    periodTotalDuration.total("milliseconds")) *
                  100
                : -(
                    (periodTimeToStart.total("milliseconds") /
                      (1000 * 60 * 60)) *
                    100
                  )
            }
            className={cn(
              "bg-background fill-foreground rounded-full transition-all group-data-[collapsible=icon]:-ml-2",
              !periodHasStarted ? "opacity-40" : "opacity-100",
            )}
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="inline-flex items-center truncate font-semibold">
              <span
                className={cn(
                  "mr-0 overflow-hidden transition-all",
                  periodHasStarted ? "w-0" : "mr-[0.3ch] w-[6ch]",
                )}
              >
                Starts in{" "}
              </span>
              {formatDuration(
                periodHasStarted ? periodTimeLeft : periodTimeToStart,
                {
                  style: "long",
                  maxUnits: 1,
                  maxUnit: "hour",
                  minUnit: "second",
                },
              )
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
                  !periodHasStarted ? "w-0" : "w-[10ch]",
                )}
              >
                {" "}
                left
              </span>
            </span>
            <span className="text-muted-foreground truncate text-xs">
              in{" "}
              {currentPeriod?.period?.type == "course"
                ? currentPeriod?.option?.type == "course"
                  ? (currentPeriod?.option?.data?.classification ?? "No Class")
                  : "No Class"
                : currentPeriod?.period?.periodName}{" "}
              (
              {currentPeriod?.period?.type == "course"
                ? currentPeriod?.option?.type == "course"
                  ? (currentPeriod?.option?.data?.original_name ?? "No Class")
                  : "No Class"
                : currentPeriod?.period?.optionName}
              )
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
        {currentCourse?.period?.id != currentPeriod.period.id && (
          <div className="text-muted-foreground bg-secondary my-1 flex flex-col gap-1 rounded p-2 pl-8 text-xs">
            <div className="flex items-center overflow-hidden">
              {formatDuration(
                periodHasStarted ? periodTimeLeft : periodTimeToStart,
                {
                  style: "digital",
                  maxUnit: "hour",
                  minUnit: "second",
                },
              )
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
                {currentPeriod?.time?.start?.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
              <span>{currentPeriod?.period?.periodName}</span>
              <span>
                {currentPeriod?.time?.end?.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
            </div>
          </div>
        )}
        <div className="text-muted-foreground bg-secondary my-1 flex flex-col gap-1 rounded p-2 pl-8 text-xs">
          <div className="flex items-center overflow-hidden">
            {formatDuration(
              courseHasStarted ? courseTimeLeft : courseTimeToStart,
              {
                style: "digital",
                maxUnit: "hour",
                minUnit: "second",
              },
            )
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
              {currentPeriod?.time?.start?.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
            {currentCourse?.period?.id != currentPeriod.period.id && (
              <span>{currentCourse?.period?.periodName}</span>
            )}
            <span>
              {currentPeriod?.time?.end?.toLocaleTimeString(undefined, {
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
          <button
            onClick={async () => {
              if (pip?.schedule?.isOpen()) {
                await pip?.schedule?.close();
              } else {
                await pip?.schedule?.open();
              }
            }}
            disabled={!pip?.schedule?.canOpen()}
            className={cn("w-full", !pip?.schedule?.canOpen() && "opacity-50")}
          >
            {pip?.schedule?.isOpen() ? (
              <div className="flex items-center gap-2">
                <DoorOpen />
                <span>Close Mini Mode</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PictureInPicture2 />
                <span>Open Mini Mode</span>
              </div>
            )}
            {!pip?.schedule?.canOpen() && (
              <Tooltip>
                <TooltipTrigger className="absolute inset-0" asChild>
                  <div />
                </TooltipTrigger>
                <TooltipContent side="right">
                  Mini Mode is not available on this device / browser.
                </TooltipContent>
              </Tooltip>
            )}
          </button>
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
      Log Out
    </DropdownMenuItem>
  );
}

export function AppSidebarClient({
  user,
  session,
}: {
  user: ApiCtx["user"];
  session: Session | null;
}) {
  const cookies = useMemo(() => new Cookies(), []);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/app"
                className="group-[[data-state='collapsed']]:!bg-sidebar group [&:hover>*[data-icon]]:bg-primary/60 h-10 pl-3"
              >
                <div
                  className="bg-primary/80 text-foreground flex aspect-square size-6 items-center justify-center rounded-lg transition-all group-[[data-state='collapsed']]:-ml-1"
                  data-icon
                >
                  <FlaskConical className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Catalyst</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="bg-secondary mx-2 my-1 h-0.5 rounded-full data-[state=open]:mx-4" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="-mt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <OpenCommandMenu>
                <SidebarMenuButton tooltip="Search" className="cursor-pointer">
                  <Search />
                  <span>Search</span>
                  <div className="text-muted-foreground ml-auto flex items-center gap-1">
                    <kbd className="bg-muted flex h-6 items-center justify-center rounded-full border px-1.5 text-xs font-semibold">
                      {navigator.platform.includes("Mac") ? (
                        <Command className="size-3" />
                      ) : (
                        "Ctrl"
                      )}
                    </kbd>
                    <kbd className="bg-muted flex size-6 items-center justify-center rounded-full border px-1.5 text-xs font-semibold">
                      /
                    </kbd>
                  </div>
                </SidebarMenuButton>
              </OpenCommandMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Social">
                <Link href="/app/social">
                  <UsersRound />
                  <span>Social</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="School">
                <Link href="/app/schools">
                  <School />
                  <span>School</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <Accordion
          saveId="sidebar"
          type="multiple"
          values={["courses", "messages"]}
          defaultValue={[
            cookies.get("accordion-state-sidebar-courses") == "false"
              ? ""
              : "courses",
            cookies.get("accordion-state-sidebar-messages") == "false"
              ? ""
              : "messages",
          ]}
        >
          <AccordionItem value="courses" className="group">
            <SidebarGroup>
              <AccordionHeader className="-mt-2 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:-mt-4">
                <SidebarGroupLabel className="flex h-10 justify-between">
                  Courses
                  <AccordionTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground grid size-6 shrink-0 cursor-pointer place-items-center rounded-full transition-all">
                    <ChevronRight className="size-4 transform opacity-0 transition-all group-hover:opacity-100 group-data-[state=open]:rotate-90" />
                  </AccordionTrigger>
                </SidebarGroupLabel>
              </AccordionHeader>
              <AccordionContent className="group-data-[state=open]:animate-accordion-down group-data-[state=closed]:animate-accordion-up overflow-hidden pt-2 transition-all">
                <SidebarMenu>
                  <CoursesGroupClient />
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="View all Courses">
                      <Link href="/app/courses" className="h-12 rounded-full">
                        <Logs />
                        <span>View all Courses</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
          <AccordionItem value="messages" className="group">
            <SidebarGroup>
              <AccordionHeader className="-mt-2 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:-mt-4">
                <SidebarGroupLabel className="flex h-10 justify-between">
                  Messages
                  <AccordionTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground grid size-6 shrink-0 cursor-pointer place-items-center rounded-full transition-all">
                    <ChevronRight className="size-4 transform opacity-0 transition-all group-hover:opacity-100 group-data-[state=open]:rotate-90" />
                  </AccordionTrigger>
                </SidebarGroupLabel>
              </AccordionHeader>
              <AccordionContent className="group-data-[state=open]:animate-accordion-down group-data-[state=closed]:animate-accordion-up overflow-hidden pt-2 transition-all">
                <SidebarMenu>
                  <div className="rounded-lg border px-2 py-4 group-data-[collapsible=icon]:h-16">
                    <Construction className="text-muted-foreground mt-8 size-8 group-data-[collapsible=icon]:opacity-0" />
                    <h2 className="h3 group-data-[collapsible=icon]:opacity-0">
                      Area under construction
                    </h2>
                    <p className="text-muted-foreground text-xs group-data-[collapsible=icon]:opacity-0">
                      This area is under construction and will be available
                      soon.
                    </p>
                  </div>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="View all Messages">
                      <Link
                        href="/app/social/chats"
                        className="h-12 rounded-full"
                      >
                        <MessageCircle />
                        <span>View all Messages</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
        </Accordion>
      </SidebarContent>
      <SidebarFooter className="pt-2">
        <div className="bg-secondary mx-2 my-1 h-0.5 rounded-full data-[state=open]:mx-4" />
        <LinkModal
          link="/app/todo/create"
          trigger={
            <Button
              className="h-auto w-full justify-start group-data-[state=collapsed]:h-8 group-data-[state=collapsed]:w-8"
              variant="secondary"
            >
              <span className="group-data-[state=expanded]:bg-background -ml-2 group-data-[state=expanded]:-ml-1.5 group-data-[state=expanded]:rounded-full group-data-[state=expanded]:p-1">
                <Plus />
              </span>
              <span className="flex group-data-[state=collapsed]:hidden">
                New Todo Item
              </span>
            </Button>
          }
          title="Planner Note"
          description="View this planner note"
          breadcrumbs={<Breadcrumbs pathname="/app/todo/create" />}
          content={<CreateTodoItemModalPage />}
        />
        <ScheduleWidget />
        <div className="bg-secondary mx-auto my-1 h-0.5 w-8 rounded-full" />
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer pr-3 pl-1"
                  tooltip="Profile"
                >
                  <Avatar className="h-8 w-8 rounded-lg group-[[data-state='collapsed']]:-ml-2">
                    <AvatarImage
                      src={session?.user?.image ?? ""}
                      alt={session?.user?.name ?? ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {session?.user?.name
                        ?.split(" ")
                        .map((word) => word[0]!.toUpperCase())
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {session?.user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[18rem] min-w-56 rounded-lg"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user?.image ?? ""}
                        alt={session?.user?.name ?? ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session?.user?.name}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.name}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <div className="bg-secondary mx-4 my-1 h-0.5 rounded-full" />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Statuses</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <div className="mx-1 flex size-2 rounded-full bg-green-500" />
                    Available
                    <Check className="ml-auto opacity-100" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Moon className="mx-1 size-2 fill-yellow-500 stroke-yellow-500" />
                    Idle
                    <Check className="ml-auto opacity-0" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="mx-1 size-2 fill-blue-500 stroke-blue-500" />
                    Working
                    <Check className="ml-auto opacity-0" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="mx-1 flex size-2 rounded-full border-2 border-gray-500" />
                    Invisible
                    <Check className="ml-auto opacity-0" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <div className="bg-secondary mx-4 my-1 h-0.5 rounded-full" />
                <SignOut />
                <DropdownMenuItem asChild>
                  <Link href="/home">
                    <DoorOpen />
                    <span>Exit App</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <X />
                  Close
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="flex flex-row gap-2 group-data-[state=collapsed]:flex-col">
          <SidebarMenuItem className="flex-1">
            <SidebarMenuButton asChild tooltip="Feedback & Support">
              <Tooltip>
                <TooltipTrigger asChild>
                  <LinkModal
                    link="/app/feedback"
                    trigger={
                      <Button
                        variant="ghost"
                        className="bg-destructive/20 hover:bg-destructive/40 h-10 w-16 transition-all group-data-[state=collapsed]:h-8 group-data-[state=collapsed]:w-8"
                      >
                        <DiamondPlus />
                      </Button>
                    }
                    title="Feedback"
                    description="Send Feedback"
                    breadcrumbs={<Breadcrumbs pathname="/app/feedback" />}
                    content={
                      <FeedbackModalPage
                        email={user.get?.email ?? "{provided email}"}
                      />
                    }
                  />
                </TooltipTrigger>
                <TooltipContent className="group-data-[state=collapsed]:hidden]">
                  Feedback & Support
                </TooltipContent>
              </Tooltip>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex-1">
            <SidebarMenuButton asChild tooltip="Announcements & Updates">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    href="/app/updates"
                    variant="ghost"
                    className="h-10 w-16 group-data-[state=collapsed]:h-8 group-data-[state=collapsed]:w-8"
                  >
                    <Megaphone />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="group-data-[state=collapsed]:hidden]">
                  Announcements & Updates
                </TooltipContent>
              </Tooltip>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex-1">
            <SidebarMenuButton asChild>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    href="/app/notifications"
                    variant="ghost"
                    className="h-10 w-16 group-data-[state=collapsed]:h-8 group-data-[state=collapsed]:w-8"
                  >
                    <Bell />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="group-data-[state=collapsed]:hidden]">
                  Notifications
                </TooltipContent>
              </Tooltip>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton asChild tooltip="Settings">
                  <LinkModal
                    link="/app/settings"
                    trigger={
                      <Button
                        variant="ghost"
                        className="h-10 w-16 group-data-[state=collapsed]:h-8 group-data-[state=collapsed]:w-8"
                      >
                        <Settings />
                      </Button>
                    }
                    title="Settings"
                    description="Modify Settings"
                    breadcrumbs={<Breadcrumbs pathname="/app/settings" />}
                    content={<SettingsModalPage modal={true} />}
                  />
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent className="group-data-[state=collapsed]:hidden]">
                Settings
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
