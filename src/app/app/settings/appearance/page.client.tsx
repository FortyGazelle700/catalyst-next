"use client";

import { Button } from "@/components/ui/button";
import type { ApiCtx } from "@/server/api";
import {
  ArrowRight,
  Check,
  Gem,
  Lamp,
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

export default function AppearanceSettings({
  setLink,
}: {
  link: string;
  setLink: Dispatch<SetStateAction<string>>;
  settings: ApiCtx["user"]["settings"];
  setSettings: Dispatch<SetStateAction<ApiCtx["user"]["settings"]>>;
}) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme != "oled") {
      document.documentElement.classList.remove("oled");
    }
  }, [theme]);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <SunMoon /> Color Mode
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-2">
        <div
          className={cn(
            "stack relative rounded-md",
            theme == "light" && "outline-primary/50 outline-2 outline-offset-4",
          )}
        >
          <Button
            variant="outline"
            className="h-36 flex-1 flex-col items-start justify-end bg-white text-black hover:bg-gray-200 dark:bg-gray-400 dark:hover:bg-gray-500"
            onClick={() => setTheme("light")}
            aria-pressed={theme == "light"}
          >
            <Sun className="size-6" />
            <span className="text-xl font-bold">Light</span>
          </Button>
          {theme == "light" && (
            <div className="bg-background absolute right-2 bottom-2 flex items-center justify-center gap-1 rounded-full border px-2 py-1 text-xs">
              <Check className="size-3" /> Selected
            </div>
          )}
        </div>
        <div
          className={cn(
            "stack relative rounded-md",
            theme == "dark" && "outline-primary/50 outline-2 outline-offset-4",
          )}
        >
          <Button
            variant="outline"
            className="h-36 flex-1 flex-col items-start justify-end bg-slate-500 !text-white hover:bg-slate-600 dark:bg-slate-950 dark:text-gray-200 dark:hover:bg-slate-800"
            onClick={() => setTheme("dark")}
            aria-pressed={theme == "dark"}
          >
            <Moon className="size-6" />
            <span className="text-xl font-bold">Dark</span>
          </Button>
          {theme == "dark" && (
            <div className="bg-background absolute right-2 bottom-2 flex items-center justify-center gap-1 rounded-full border px-2 py-1 text-xs">
              <Check className="size-3" /> Selected
            </div>
          )}
        </div>
        <div
          className={cn(
            "stack relative rounded-md",
            theme == "system" &&
              "outline-primary/50 outline-2 outline-offset-4",
          )}
        >
          <Button
            variant="outline"
            className="group relative h-36 w-full flex-1 flex-col items-start justify-end overflow-hidden"
            onClick={() => setTheme("system")}
            aria-pressed={theme == "system"}
          >
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
            <Monitor className="z-10 size-6" />
            <span className="z-10 text-xl font-bold">System</span>
          </Button>
          {theme == "system" && (
            <div className="bg-background absolute right-2 bottom-2 flex items-center justify-center gap-1 rounded-full border px-2 py-1 text-xs">
              <Check className="size-3" /> Selected
            </div>
          )}
        </div>
        <div
          className={cn(
            "stack relative rounded-md",
            theme == "oled" && "outline-primary/50 outline-2 outline-offset-4",
          )}
        >
          <Button
            variant="outline"
            className="bg-black-500 h-36 flex-1 flex-col items-start justify-end bg-black !text-white hover:bg-gray-900"
            onClick={() => setTheme("oled")}
            aria-pressed={theme == "oled"}
          >
            <Moon className="size-6" />
            <span className="text-xl font-bold">OLED</span>
          </Button>
          {theme == "oled" && (
            <div className="bg-background absolute right-2 bottom-2 flex items-center justify-center gap-1 rounded-full border px-2 py-1 text-xs">
              <Check className="size-3" /> Selected
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <Paintbrush /> Color Theme
        </h2>
      </div>
      <div className="flex gap-4">
        <span className="text-muted-foreground flex w-full items-center justify-center py-8 text-xs">
          This feature is not available yet
        </span>
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
