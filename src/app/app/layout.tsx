import { RadialChart } from "@/components/catalyst/radial-chart";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import {
  BadgeCheck,
  Bell,
  Calculator,
  Check,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Command,
  Construction,
  CreditCard,
  DiamondPlus,
  DoorOpen,
  ExternalLink,
  FlaskConical,
  HelpCircle,
  House,
  LayoutDashboard,
  LogOut,
  Logs,
  Megaphone,
  MessageCircle,
  Moon,
  Pencil,
  Percent,
  Plus,
  School,
  Search,
  Settings,
  Sparkles,
  Timer,
  UsersRound,
  X,
} from "lucide-react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/server/api";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { unstable_cache } from "next/cache";
import { cn } from "@/lib/utils";
import { subjectColors, SubjectIcon } from "@/components/catalyst/subjects";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { CoursesGroupClient, ScheduleWidget, SignOut } from "./layout.client";
import { AppLayoutProviders } from "./layout.providers";
import { Breadcrumbs } from "./breadcrumbs";
import { LinkModal } from "@/components/catalyst/link-modal";
import CreateTodoItemModalPage from "./todo/create/page.modal";

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

  return <AppLayout children={children} />;
}

async function AppLayout({ children }: { children: React.ReactNode }) {
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
    [session?.user?.id ?? "", "courses"]
  )();

  return (
    <div className="bg-sidebar">
      <AppLayoutProviders courses={courses}>
        <SidebarProvider
          defaultOpen={sidebarOpen == "true"}
          className="bg-sidebar max-w-full max-h-screen overflow-hidden"
        >
          <AppSidebar />
          <div className="flex-1 flex flex-col gap-2 p-2 max-w-full max-h-full overflow-hidden">
            <div className="h-12 flex gap-4 items-center p-2">
              <SidebarTrigger
                variant="outline"
                className="size-10 bg-sidebar"
              />
              <Breadcrumbs />
            </div>
            <SidebarInset className="flex-1 rounded-2xl overflow-auto max-w-full max-h-full">
              {children}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </AppLayoutProviders>
    </div>
  );
}

async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/app"
                className="h-10 pl-3 group-[[data-state='collapsed']]:!bg-sidebar group [&:hover>*[data-icon]]:bg-green-400"
              >
                <div
                  className="flex aspect-square size-6 items-center justify-center rounded-lg bg-green-500 text-black group-[[data-state='collapsed']]:-ml-1 transition-all"
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
        <div className="h-0.5 rounded-full bg-secondary my-1 mx-2 data-[state=open]:mx-4" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="-mt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Search">
                <Link href="/app/search">
                  <Search />
                  <span>Search</span>
                </Link>
              </SidebarMenuButton>
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
              <AccordionHeader className="group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:-mt-4 -mt-2">
                <SidebarGroupLabel className="flex justify-between h-10">
                  Courses
                  <AccordionTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all cursor-pointer size-6 rounded-full flex-shrink-0 grid place-items-center">
                    <ChevronRight className="transform group-data-[state=open]:rotate-90 group-hover:opacity-100 opacity-0 transition-all size-4" />
                  </AccordionTrigger>
                </SidebarGroupLabel>
              </AccordionHeader>
              <AccordionContent className="overflow-hidden transition-all pt-2 group-data-[state=open]:animate-accordion-down group-data-[state=closed]:animate-accordion-up">
                <SidebarMenu>
                  <Suspense fallback={<CoursesGroupFallback />}>
                    <CoursesGroupClient />
                  </Suspense>
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
              <AccordionHeader className="group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:-mt-4 -mt-2">
                <SidebarGroupLabel className="flex justify-between h-10">
                  Messages
                  <AccordionTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all cursor-pointer size-6 rounded-full flex-shrink-0 grid place-items-center">
                    <ChevronRight className="transform group-data-[state=open]:rotate-90 group-hover:opacity-100 opacity-0 transition-all size-4" />
                  </AccordionTrigger>
                </SidebarGroupLabel>
              </AccordionHeader>
              <AccordionContent className="overflow-hidden transition-all pt-2 group-data-[state=open]:animate-accordion-down group-data-[state=closed]:animate-accordion-up">
                <SidebarMenu>
                  <div className="border rounded-lg px-2 py-4 group-data-[collapsible=icon]:h-16">
                    <Construction className="size-8 text-muted-foreground mt-8 group-data-[collapsible=icon]:opacity-0" />
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
        <div className="h-0.5 rounded-full bg-secondary my-1 mx-2 data-[state=open]:mx-4" />
        <LinkModal
          link="/app/todo/create"
          trigger={
            <Button
              className="group-data-[state=collapsed]:h-8 group-data-[state=collapsed]:w-8 w-full justify-start h-auto"
              variant="secondary"
            >
              <span className="group-data-[state=expanded]:bg-background group-data-[state=expanded]:rounded-full group-data-[state=expanded]:p-1 group-data-[state=expanded]:-ml-1.5 -ml-2">
                <Plus />
              </span>
              <span className="group-data-[state=collapsed]:hidden flex">
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
        <div className="h-0.5 rounded-full bg-secondary my-1 mx-auto w-8" />
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pl-1 pr-3 cursor-pointer"
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
                    <span className="truncate text-xs text-muted-foreground">
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
                      <span className="truncate text-xs text-muted-foreground">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <div className="h-0.5 rounded-full bg-secondary my-1 mx-4" />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Statuses</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <div className="flex size-2 mx-1 rounded-full bg-green-500" />
                    Available
                    <Check className="opacity-100 ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Moon className="size-2 fill-yellow-500 stroke-yellow-500 mx-1" />
                    Idle
                    <Check className="opacity-0 ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="size-2 fill-blue-500 stroke-blue-500 mx-1" />
                    Working
                    <Check className="opacity-0 ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex size-2 mx-1 rounded-full border-2 border-gray-500" />
                    Invisible
                    <Check className="opacity-0 ml-auto" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <div className="h-0.5 rounded-full bg-secondary my-1 mx-4" />
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
        <SidebarMenu className="flex-row group-data-[state=collapsed]:flex-col flex gap-2">
          <SidebarMenuItem className="flex-1">
            <SidebarMenuButton asChild tooltip="Feedback & Support">
              <Button href="/app/feedback" variant="ghost">
                <DiamondPlus />
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex-1">
            <SidebarMenuButton asChild tooltip="Announcements & Updates">
              <Button href="/app/updates" variant="ghost">
                <Megaphone />
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex-1">
            <SidebarMenuButton asChild tooltip="Notifications">
              <Button href="/app/notifications" variant="ghost">
                <Bell />
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex-1">
            <SidebarMenuButton asChild tooltip="Settings">
              <Button href="/app/settings" variant="ghost">
                <Settings />
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function CoursesGroupFallback() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-12" />
      ))}
    </>
  );
}
