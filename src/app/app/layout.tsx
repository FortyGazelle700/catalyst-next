import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { FlaskConical } from "lucide-react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/server/api";
import { unstable_cache } from "next/cache";
import { Button } from "@/components/ui/button";
import { MobileNav, AppSidebarClient } from "./layout.client";
import { AppLayoutProviders } from "./layout.providers";
import { Breadcrumbs } from "./breadcrumbs";
import { ErrorBoundary } from "react-error-boundary";
import Error from "@/app/error";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import RealtimeManager from "./realtime-manager";

export default async function AppRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const url = new URL((await headers()).get("x-url") ?? "/app");

  if (!session?.authorized) {
    redirect(`/app/auth?redirectTo=${url.pathname}`);
  }

  const requiredSettings = [
    "f_name",
    "l_name",
    "grade",
    "school_id",
    "canvas_token",
  ];
  const { data: settings } = await (
    await api({ session })
  ).catalyst.account.settings.list();

  if (!requiredSettings.every((key) => Object.keys(settings).includes(key))) {
    redirect(`/app/onboarding?redirectTo=${url.pathname}`);
  }

  return <AppLayout url={url}>{children}</AppLayout>;
}

async function AppLayout({
  url: _,
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
        data-default-open={sidebarOpen == "true"}
        className={cn(
          "bg-sidebar max-h-svh max-w-full overflow-hidden",
          sidebarOpen == "false" && "[&>[data-loading]]:w-14.5",
        )}
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
          <SidebarInset className="max-h-full max-w-full flex-1 overflow-auto rounded-2xl border">
            <ErrorBoundary FallbackComponent={Error}>
              <div className="flex flex-1 flex-col gap-4 overflow-x-hidden">
                {children}
              </div>
            </ErrorBoundary>
            <div className="pointer-events-none absolute top-0 z-10 flex h-full w-full items-stretch justify-stretch overflow-clip">
              <Toaster
                richColors
                position="bottom-left"
                className="pointer-events-auto !absolute"
              />
            </div>
            <RealtimeManager />
          </SidebarInset>
          <MobileNav />
        </div>
      </SidebarProvider>
    </AppLayoutProviders>
  );
}

async function AppSidebar() {
  const session = await auth();
  const { user } = await (await api({ session })).catalyst.getCtx();

  return <AppSidebarClient session={session} user={user} />;
}
