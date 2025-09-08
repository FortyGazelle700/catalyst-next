"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  Sidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ApiCtx } from "@/server/api";
import {
  Settings,
  UserCircle,
  BellDot,
  Lock,
  MonitorSmartphone,
  Gem,
  LogOut,
  Trash,
  School,
  Wrench,
  Paintbrush,
  Save,
  Loader,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const sidebarItems = [
  { icon: <UserCircle />, label: "Account", link: "/account" },
  {
    icon: <Paintbrush />,
    label: "Appearance",
    link: "/appearance",
  },
  { icon: <Lock />, label: "Security", link: "/security" },
  {
    icon: <MonitorSmartphone />,
    label: "Sessions",
    link: "/sessions",
  },
  {
    icon: <School />,
    label: "School Integration",
    link: "/integration",
  },
  {
    icon: <BellDot />,
    label: "Notifications",
    link: "/notifications",
  },
  { icon: <Wrench />, label: "Experiments", link: "/experiments" },
];

const nonRenderedItems = [
  { icon: <Gem />, label: "Upgrade to Pro", link: "/upgrade" },
  { icon: <Trash />, label: "Destructive Actions", link: "/destructive" },
];

export default function SettingsClientRenderer({
  modal = false,
}: {
  modal?: boolean;
}) {
  const [settings, setSettings] = useState<ApiCtx["user"]["settings"]>({});
  const [isPro, setIsPro] = useState(false);
  const [defaultSettings, setDefaultSettings] = useState<
    ApiCtx["user"]["settings"]
  >({});
  const [link, setLink] = useState("/account");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("page", link);
    window.history.replaceState(null, "", url.toString());
  }, [link]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const newLink = url.searchParams.get("page") ?? "/account";
    setLink(newLink);
    url.searchParams.set("page", newLink);
    window.history.replaceState(null, "", url.toString());

    (async () => {
      const req = await fetch("/api/catalyst/account/settings/list");
      const res = (await req.json()) as {
        data: ApiCtx["user"]["settings"];
        errors: { message: string }[];
        success: boolean;
      };
      setSettings(res.data ?? {});
      setDefaultSettings(res.data ?? {});
    })().catch(console.error);

    (async () => {
      const req = await fetch("/api/catalyst/account/isPro");
      const res = (await req.json()) as {
        data: boolean;
        errors: { message: string }[];
        success: boolean;
      };
      setIsPro(res.data ?? false);
    })().catch(console.error);
  }, []);

  const SettingPageRenderer = useMemo(() => {
    return dynamic(
      async () => {
        type Module = {
          default: React.ComponentType<{
            link: string;
            setLink: (link: string) => void;
            settings: ApiCtx["user"]["settings"];
            setSettings: (settings: ApiCtx["user"]["settings"]) => void;
            defaultSettings: ApiCtx["user"]["settings"];
            isPro: boolean;
          }>;
        };
        try {
          const moduleList = (await import(
            `./${link.replace("/", "")}/page.client`
          )) as Module;
          return moduleList.default;
        } catch (error) {
          console.warn("Failed to load settings page:", error);
          const moduleList = (await import(
            `./not-found/page.client`
          )) as Module;
          return moduleList.default;
        }
      },
      {
        ssr: false,
        loading: () => (
          <div className="flex w-full flex-col gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex w-full max-w-md flex-col gap-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            ))}
          </div>
        ),
      },
    );
  }, [link]);

  return (
    <div
      className={cn(
        "@container flex h-full w-full overflow-auto @4xl:overflow-hidden",
        modal &&
          "-mx-4 -my-8 h-[calc(100%+theme(spacing.12))] max-h-136 w-[calc(100%+theme(spacing.8))]",
      )}
    >
      <div className="flex h-max w-full flex-col-reverse items-stretch overflow-auto @4xl:h-full @4xl:flex-row @4xl:overflow-hidden">
        <div className="min-h-max flex-1 overflow-clip overflow-x-auto px-10 py-12 @4xl:h-[calc(100%-var(--spacing)*4)] @4xl:min-h-full @4xl:overflow-auto">
          <h1 className="h1 mb-2">
            {[...sidebarItems, ...nonRenderedItems].find(
              (item) => item.link === link,
            )?.label ?? "Settings"}
          </h1>
          {Object.keys(settings).length > 0 ? (
            <SettingPageRenderer
              link={link}
              setLink={setLink}
              settings={settings}
              setSettings={setSettings}
              defaultSettings={defaultSettings}
              isPro={isPro}
            />
          ) : (
            <div className="flex w-full flex-col gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex w-full max-w-md flex-col gap-2"
                >
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          )}
        </div>
        <ModuleSidebar
          link={link}
          setLink={setLink}
          settings={settings}
          setSettings={setSettings}
          defaultSettings={defaultSettings}
          setDefaultSettings={setDefaultSettings}
          isPro={isPro}
        />
      </div>
    </div>
  );
}

function ModuleSidebar({
  link,
  setLink,
  settings,
  setSettings,
  defaultSettings,
  setDefaultSettings,
  isPro,
}: {
  link: string;
  setLink: (link: string) => void;
  settings: Record<string, string>;
  setSettings: (settings: Record<string, string>) => void;
  defaultSettings: Record<string, string>;
  setDefaultSettings: (settings: Record<string, string>) => void;
  isPro: boolean;
}) {
  const hasSettingsChanged = useMemo(
    () =>
      JSON.stringify({
        ...settings,
        periods: undefined,
      }) == JSON.stringify(defaultSettings),
    [settings, defaultSettings],
  );

  const actualSettings = useMemo(
    () => ({
      ...settings,
      tokenIsSaved: undefined,
      periods: undefined,
      periodsChanged: undefined,
    }),
    [settings],
  );

  const [isSaving, setIsSaving] = useState(false);

  return (
    <>
      <Sidebar
        collapsible="none"
        className="scrollbar-auto m-2 min-h-max w-[calc(100%-1rem)] overflow-auto rounded-xs @4xl:h-full @4xl:w-[20rem]"
      >
        <SidebarHeader className="px-6 pt-6 pb-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Settings /> Settings
          </h1>
        </SidebarHeader>
        <SidebarContent className="overflow-hidden px-3 pb-4">
          <SidebarGroup className="flex h-full flex-col gap-1 overflow-auto [&>*]:shrink-0">
            {sidebarItems.map(({ icon, label, link: itemLink }) => (
              <Button
                key={itemLink}
                variant="ghost"
                data-active={link.startsWith(itemLink)}
                className="hover:!bg-secondary justify-start data-[active='true']:bg-[color-mix(in_oklch,var(--ui-primary)_15%,var(--ui-secondary))]"
                onClick={() => setLink(itemLink)}
              >
                {icon} {label}
              </Button>
            ))}
            <div className="mt-24 flex-1" />
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 justify-start"
                onClick={async () => {
                  setIsSaving(true);
                  if (settings.periods) {
                    await fetch("/api/catalyst/account/settings/set-periods", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        periods: JSON.parse(settings.periods) as unknown,
                      }),
                    });
                  }
                  await fetch("/api/catalyst/account/settings/set-many", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ settings: actualSettings }),
                  });
                  setSettings({
                    ...actualSettings,
                    canvas_token: undefined,
                  } as unknown as Record<string, string>);
                  setDefaultSettings({
                    ...actualSettings,
                    canvas_token: undefined,
                  } as unknown as Record<string, string>);
                  setIsSaving(false);
                }}
                disabled={hasSettingsChanged || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save /> Save
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="size-10"
                onClick={() => {
                  setSettings(defaultSettings);
                }}
                disabled={hasSettingsChanged || isSaving}
              >
                <X />
              </Button>
            </div>
            <div>
              <div className="bg-border mx-auto my-2 h-1 w-10 rounded-full" />
            </div>
            <Button
              variant="ghost"
              className="group relative isolate justify-start overflow-clip"
              data-active={link.startsWith("/upgrade")}
              onClick={() => setLink("/upgrade")}
            >
              <div className="animate-gradient-shift absolute inset-0 -z-10 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-size-[500%_100%] opacity-25 transition-opacity group-hover:!opacity-40 group-data-[active='true']:opacity-60" />
              <div className="bg-sidebar absolute inset-0.75 -z-10 rounded-full transition-all group-hover:inset-5 group-data-[active='true']:inset-5" />
              <Gem /> {isPro ? "Pro Status" : "Upgrade to Pro"}
            </Button>
            <Button
              variant="ghost"
              className="hover:!bg-destructive data-[active='true']:text-foreground data-[active='true']:bg-destructive/50 text-destructive-foreground justify-start"
              data-active={link.startsWith("/destructive")}
              onClick={() => setLink("/destructive")}
            >
              <Trash /> Destructive Actions
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={async () => {
                await signOut({
                  redirectTo: "/home",
                });
              }}
            >
              <LogOut /> Log Out
            </Button>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
