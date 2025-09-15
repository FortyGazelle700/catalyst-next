"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { WheelPicker, WheelPickerWrapper } from "@/components/ui/wheel-picker";
import type { ApiCtx } from "@/server/api";
import {
  AlertCircle,
  ArrowRight,
  BellDot,
  ChevronsUpDown,
  Info,
  ListTree,
  Trash,
  Wrench,
} from "lucide-react";
import { type SetStateAction, type Dispatch } from "react";

export default function NotificationSettings({
  settings,
  setSettings,
  setLink,
}: {
  link: string;
  setLink: Dispatch<SetStateAction<string>>;
  settings: ApiCtx["user"]["settings"];
  setSettings: Dispatch<SetStateAction<ApiCtx["user"]["settings"]>>;
  isPro: boolean;
}) {
  const submissionAlerts = JSON.parse(settings.submission_alerts ?? "[]") as {
    minutes: number;
    hours: number;
  }[];
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <BellDot /> Global Notification Methods
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <label className="text-muted-foreground flex w-full items-center justify-between gap-2 rounded-full border px-4 py-2">
          <span>On Device</span>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>Not available yet</span>
            </span>
            <Switch disabled />
          </div>
        </label>
        <label className="text-muted-foreground flex w-full items-center justify-between gap-2 rounded-full border px-4 py-2">
          <span>Email</span>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground flex items-center gap-1 text-xs"></span>
            <Switch
              checked={settings.email_notifications == "true" ? true : false}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  email_notifications: checked ? "true" : "false",
                })
              }
            />
          </div>
        </label>
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <AlertCircle /> Submission Alerts
        </h2>
      </div>
      {[...submissionAlerts, { hours: 0, minutes: 0 }]
        .filter((_, i) => i < 5)
        .map((alert, idx) => (
          <div
            key={idx}
            className="flex w-full items-center justify-between gap-2 rounded-full border p-2"
          >
            <div className="flex w-[20ch] items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="dark:bg-input/30 flex w-full justify-between"
                  >
                    <span>
                      {alert.hours}h {alert.minutes}m
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <WheelPickerWrapper>
                    <WheelPicker
                      options={Array.from({ length: 24 + 1 }).map((_, i) => ({
                        label: i.toString(),
                        value: i.toString(),
                      }))}
                      value={alert.hours.toString()}
                      onValueChange={(val) =>
                        setSettings({
                          ...settings,
                          ["submission_alerts"]: JSON.stringify([
                            ...submissionAlerts.slice(0, idx),
                            { hours: parseInt(val), minutes: alert.minutes },
                            ...submissionAlerts.slice(idx + 1),
                          ]),
                        })
                      }
                    />
                    <span className="bg-accent/50 my-auto flex h-7.5 items-center justify-center">
                      h
                    </span>
                    <WheelPicker
                      options={Array.from({ length: 60 / 5 }).map((_, i) => ({
                        label: (i * 5).toString(),
                        value: (i * 5).toString(),
                      }))}
                      value={alert.minutes.toString()}
                      onValueChange={(val) =>
                        setSettings({
                          ...settings,
                          ["submission_alerts"]: JSON.stringify([
                            ...submissionAlerts.slice(0, idx),
                            { hours: alert.hours, minutes: parseInt(val) },
                            ...submissionAlerts.slice(idx + 1),
                          ]),
                        })
                      }
                    />
                    <span className="bg-accent/50 my-auto flex h-7.5 items-center justify-center rounded-r-full pr-12">
                      m
                    </span>
                  </WheelPickerWrapper>
                </PopoverContent>
              </Popover>
              before
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="ml-auto"
              disabled={idx == submissionAlerts.length}
              onClick={() => {
                const newAlerts = submissionAlerts.filter((_, i) => i != idx);
                setSettings({
                  ...settings,
                  ["submission_alerts"]: JSON.stringify(newAlerts),
                });
              }}
            >
              <Trash />
            </Button>
          </div>
        ))}
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <ListTree /> Related Settings
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-2">
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/experiments")}
        >
          <div className="flex items-center gap-3">
            <Wrench className="size-6" />
            <span>Experiments</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
