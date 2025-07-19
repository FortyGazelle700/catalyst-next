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
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import {
  Bell,
  BookMarked,
  Check,
  ChevronRight,
  ChevronsUpDown,
  Construction,
  DiamondPlus,
  DoorOpen,
  FlaskConical,
  Logs,
  Megaphone,
  MessageCircle,
  Moon,
  Pencil,
  Plus,
  School,
  Search,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/server/api";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@/components/catalyst/accordion";
import { Button } from "@/components/ui/button";
import { ScheduleWidget, SignOut } from "./layout.client";
import { AppLayoutProviders } from "./layout.providers";
import { Breadcrumbs } from "./breadcrumbs";
import { LinkModal } from "@/components/catalyst/link-modal";
import CreateTodoItemModalPage from "./todo/create/page.modal";
import "./layout.css";
import SettingsModalPage from "./settings/page.modal";
import FeedbackModalPage from "./feedback/page.modal";
import { OpenCommandMenu } from "./command-menu";
import { ErrorBoundary } from "react-error-boundary";
import Error from "@/app/error";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CoursesGroupClient } from "./layout.dynamic";
import { cn } from "@/lib/utils";

export default async function AppRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const url = new URL((await headers()).get("x-url") ?? "/app");

  if (!session) redirect(`/app/auth?redirectTo=${url.pathname}`);

  const requiredSettings = [
    "f_name",
    "l_name",
    "grade",
    "school_id",
    "canvas_token",
    // "onboarding_completed",
  ];
  const { data: settings } = await (
    await api({ session })
  ).catalyst.settings.list();

  if (!requiredSettings.every((key) => Object.keys(settings).includes(key))) {
    redirect(`/app/onboarding?redirectTo=${url.pathname}`);
  }

  return <AppLayout url={url}>{children}</AppLayout>;
}

async function AppLayout({
  url,
  children,
}: {
  url: URL;
  children: React.ReactNode;
}) {
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value;

  const session = await auth();

  const { data: courses } = await unstable_cache(
    async () =>
      await (
        await api({ session })
      ).canvas.courses.listWithPeriodData({
        enrollmentState: "active",
        limit: 100,
        offset: 1,
      }),
    [session?.user?.id ?? "", "courses"],
  )();

  return (
    <AppLayoutProviders courses={courses}>
      <SidebarProvider
        defaultOpen={sidebarOpen == "true"}
        className="bg-sidebar max-h-svh max-w-full overflow-hidden"
      >
        <AppSidebar />
        <div className="flex max-h-full max-w-full flex-1 flex-col gap-2 overflow-hidden p-2">
          <div className="flex h-12 items-center gap-4 p-2">
            <SidebarTrigger
              variant="outline"
              className="bg-sidebar hidden size-10 md:flex"
            />
            <Button
              variant="outline"
              className="bg-sidebar flex size-10 md:hidden"
              href="/app"
            >
              <FlaskConical className="size-4" />
            </Button>
            <Breadcrumbs />
          </div>
          <SidebarInset className="max-h-full max-w-full flex-1 overflow-auto rounded-2xl">
            <ErrorBoundary FallbackComponent={Error}>{children}</ErrorBoundary>
          </SidebarInset>
          <div className="flex h-20 md:hidden">
            <Button
              variant="ghost"
              href="/app"
              className="group flex h-auto flex-1 flex-col items-center justify-center gap-1 !bg-transparent p-0"
            >
              <div
                className={cn(
                  "group-hover:bg-secondary relative flex h-10 w-10 items-center justify-center rounded-lg transition-all group-hover:w-16",
                  url.pathname == "/app" &&
                    "bg-primary text-primary-foreground group-hover:bg-primary/70",
                )}
              >
                <FlaskConical className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transform stroke-current" />
              </div>
              <span className="text-primary/60">Catalyst</span>
            </Button>
            <Button
              variant="ghost"
              href="/app"
              className="group flex h-auto flex-1 flex-col items-center justify-center gap-1 !bg-transparent p-0"
            >
              <div className="group-hover:bg-secondary flex h-10 w-10 items-center justify-center rounded-lg transition-all group-hover:w-16">
                <BookMarked className="size-4" />
              </div>
              <span className="text-primary/60">Courses</span>
            </Button>
          </div>
        </div>
      </SidebarProvider>
    </AppLayoutProviders>
  );
}

async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  const { user } = await (await api({ session })).catalyst.getCtx();

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/app"
                className="group-[[data-state='collapsed']]:!bg-sidebar group h-10 pl-3 [&:hover>*[data-icon]]:bg-green-400"
              >
                <div
                  className="flex aspect-square size-6 items-center justify-center rounded-lg bg-green-500 text-black transition-all group-[[data-state='collapsed']]:-ml-1"
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
                <Link href="/app/school">
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
            (await cookies()).get("accordion-state-sidebar-courses")?.value ==
            "false"
              ? ""
              : "courses",
            (await cookies()).get("accordion-state-sidebar-messages")?.value ==
            "false"
              ? ""
              : "messages",
          ]}
        >
          <AccordionItem value="courses" className="group">
            <SidebarGroup>
              <AccordionHeader className="-mt-2 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:-mt-4">
                <SidebarGroupLabel className="flex h-10 justify-between">
                  Courses
                  <AccordionTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground grid size-6 flex-shrink-0 cursor-pointer place-items-center rounded-full transition-all">
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
                  <AccordionTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground grid size-6 flex-shrink-0 cursor-pointer place-items-center rounded-full transition-all">
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
                    content={<SettingsModalPage />}
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
