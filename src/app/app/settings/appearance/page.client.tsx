"use client";

import { Button } from "@/components/ui/button";
import type { ApiCtx } from "@/server/api";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  GalleryHorizontal,
  Gem,
  Lamp,
  LayoutDashboard,
  LayoutGrid,
  List,
  ListChecks,
  ListTree,
  Monitor,
  Moon,
  Paintbrush,
  Sun,
  SunMoon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { type SetStateAction, type Dispatch, useEffect } from "react";
import { useColorTheme } from "../../layout.providers";

export default function AppearanceSettings({
  setLink,
  settings,
  setSettings,
}: {
  link: string;
  setLink: Dispatch<SetStateAction<string>>;
  settings: ApiCtx["user"]["settings"];
  setSettings: Dispatch<SetStateAction<ApiCtx["user"]["settings"]>>;
  isPro: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [colorTheme, setColorTheme] = useColorTheme();

  useEffect(() => {
    if (theme != "oled") {
      document.documentElement.classList.remove("oled");
    }
  }, [theme]);

  useEffect(() => {
    setTimeout(() => {
      if (colorTheme != settings.color_theme) {
        setColorTheme?.(settings.color_theme ?? "default");
      }
    }, 100);
  }, [colorTheme, setColorTheme, settings]);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <SunMoon /> Color Mode
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-2">
        {[
          {
            key: "light",
            label: "Light",
            icon: Sun,
            buttonClass:
              "h-36 flex-1 flex-col items-start justify-end bg-white text-black hover:bg-gray-200 dark:bg-gray-400 dark:hover:bg-gray-500",
          },
          {
            key: "dark",
            label: "Dark",
            icon: Moon,
            buttonClass:
              "h-36 flex-1 flex-col items-start justify-end bg-slate-500 !text-white hover:bg-slate-600 dark:bg-slate-950 dark:text-gray-200 dark:hover:bg-slate-800",
          },
          {
            key: "system",
            label: "System",
            icon: Monitor,
            buttonClass:
              "group relative h-36 w-full flex-1 flex-col items-start justify-end overflow-hidden",
            svg: (
              <div className="absolute inset-0 h-full w-full">
                <svg
                  viewBox="0 0 32 32"
                  className="!h-full !w-full bg-slate-500 transition-all group-hover:bg-slate-600 dark:bg-gray-400 dark:group-hover:bg-gray-500"
                  preserveAspectRatio="none"
                >
                  <polygon
                    points="0,0 24,0 0,48"
                    className="fill-white transition-all group-hover:fill-gray-200 dark:fill-slate-950 dark:text-gray-200 dark:group-hover:fill-slate-800"
                  />
                </svg>
              </div>
            ),
          },
          {
            key: "oled",
            label: "OLED",
            icon: Lamp,
            buttonClass:
              "h-36 flex-1 flex-col items-start justify-end bg-black !text-white hover:bg-gray-900",
          },
        ].map(({ key, label, icon: Icon, buttonClass, svg }) => (
          <div
            key={key}
            className={cn(
              "stack relative rounded-md",
              theme == key && "outline-primary/50 outline-2 outline-offset-4",
            )}
          >
            <Button
              variant="outline"
              className={buttonClass}
              onClick={() => setTheme(key)}
              aria-pressed={theme == key}
            >
              {svg}
              <Icon className="z-10 size-6" />
              <span className="z-10 text-xl font-bold">{label}</span>
            </Button>
            {theme == key && (
              <div className="bg-background absolute right-2 bottom-2 flex items-center justify-center gap-1 rounded-full border px-2 py-1 text-xs">
                <Check className="size-3" /> Selected
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <Paintbrush /> Color Theme
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-2">
        {(
          [
            ["Default", "default", "green"],
            ["Neutral", "neutral", "neutral"],
            ["Stone", "stone", "stone"],
            ["Zinc", "zinc", "zinc"],
            ["Slate", "slate", "slate"],
            ["Gray", "gray", "gray"],
            ["Red", "red", "red"],
            ["Orange", "orange", "orange"],
            ["Amber", "amber", "amber"],
            ["Yellow", "yellow", "yellow"],
            ["Lime", "lime", "lime"],
            ["Green", "green", "green"],
            ["Emerald", "emerald", "emerald"],
            ["Teal", "teal", "teal"],
            ["Cyan", "cyan", "cyan"],
            ["Sky", "sky", "sky"],
            ["Blue", "blue", "blue"],
            ["Indigo", "indigo", "indigo"],
            ["Violet", "violet", "violet"],
            ["Purple", "purple", "purple"],
            ["Fuchsia", "fuchsia", "fuchsia"],
            ["Pink", "pink", "pink"],
            ["Rose", "rose", "rose"],
          ] as const
        ).map(([name, key, color]) => (
          <div
            key={key}
            className={cn(
              "stack relative rounded-md",
              colorTheme == key &&
                "outline-primary/50 outline-2 outline-offset-4",
            )}
          >
            <Button
              variant="outline"
              className={`h-36 flex-1 flex-col items-start justify-end bg-${color}-100 dark:bg-${color}-900 !text-${color}-900 hover:bg-${color}-200 dark:hover:bg-${color}-800`}
              onClick={() => {
                setSettings((prev) => ({
                  ...prev,
                  color_theme: key ?? "default",
                }));
                setColorTheme?.(key);
              }}
              aria-pressed={colorTheme == key}
            >
              <Lamp className="size-6" />
              <span className="text-xl font-bold">{name}</span>
            </Button>
            {colorTheme == key && (
              <div className="bg-background absolute right-2 bottom-2 flex items-center justify-center gap-1 rounded-full border px-2 py-1 text-xs">
                <Check className="size-3" /> Selected
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <LayoutDashboard /> Course Layout
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-3">
        {[
          {
            mode: "condensed",
            icon: GalleryHorizontal,
            label: "Condensed",
          },
          {
            mode: "grid",
            icon: LayoutGrid,
            label: "Grid",
          },
          {
            mode: "expanded",
            icon: LayoutDashboard,
            label: "Expanded",
          },
        ].map(({ mode, icon: Icon, label }) => (
          <div
            key={mode}
            className={cn(
              "stack relative rounded-md",
              settings.default_course_list_mode == mode &&
                "outline-primary/50 outline-2 outline-offset-4",
            )}
          >
            <Button
              variant="outline"
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  default_course_list_mode: mode,
                }))
              }
              className="h-36 flex-1 flex-col items-start justify-end"
              aria-pressed={settings.default_course_list_mode == mode}
            >
              <Icon className="size-6" />
              <span className="text-xl font-bold">{label}</span>
            </Button>
            {settings.default_course_list_mode == mode && (
              <div className="bg-background absolute right-2 bottom-2 flex items-center justify-center gap-1 rounded-full border px-2 py-1 text-xs">
                <Check className="size-3" /> Selected
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <ListChecks /> Todo Layout
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-3">
        {[
          {
            mode: "list",
            icon: List,
            label: "List",
          },
          {
            mode: "time",
            icon: Clock,
            label: "Timeline",
          },
          {
            mode: "calendar",
            icon: Calendar,
            label: "Calendar",
          },
        ].map(({ mode, icon: Icon, label }) => (
          <div
            key={mode}
            className={cn(
              "stack relative rounded-md",
              settings.default_todo_list_mode == mode &&
                "outline-primary/50 outline-2 outline-offset-4",
            )}
          >
            <Button
              variant="outline"
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  default_todo_list_mode: mode,
                }))
              }
              className="h-36 flex-1 flex-col items-start justify-end"
              aria-pressed={settings.default_todo_list_mode == mode}
            >
              <Icon className="size-6" />
              <span className="text-xl font-bold">{label}</span>
            </Button>
            {settings.default_todo_list_mode == mode && (
              <div className="bg-background absolute right-2 bottom-2 flex items-center justify-center gap-1 rounded-full border px-2 py-1 text-xs">
                <Check className="size-3" /> Selected
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <ListTree /> Related Settings
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-2">
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/upgrade")}
        >
          <div className="flex items-center gap-3">
            <Gem className="size-6" />
            <span>Upgrade to Pro</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
