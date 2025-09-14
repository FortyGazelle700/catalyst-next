import { Map } from "@/components/catalyst/map.dynamic";
import {
  ResponsivePopover,
  ResponsivePopoverTrigger,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
} from "@/components/catalyst/responsible-popover";
import { Button } from "@/components/ui/button";
import { api } from "@/server/api";
import { Circle, ExternalLink, MapIcon, MapPin, Settings } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CalendarView from "./page.client";

export const metadata: Metadata = {
  title: "School",
};

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: school } = await (
    await api({})
  ).catalyst.schools.get({ id: (await params).id });

  if (!school) {
    return notFound();
  }

  const { data: role } = await (
    await api({})
  ).catalyst.schools.getPermissions({ id: school.id });

  const { data: members } = await (
    await api({})
  ).catalyst.schools.members({ id: school.id });

  const { data: periods } = await (
    await api({})
  ).catalyst.schools.periods.list({ id: school.id });

  const { data: schedules } = await (
    await api({})
  ).catalyst.schools.schedules.list({ id: school.id });

  const { data: dates } = await (
    await api({})
  ).catalyst.schools.schedules.dates.list.list({
    id: school.id,
  });

  const { data: datesSchedule } = await (
    await api({})
  ).catalyst.schools.schedules.dates.schedule.list({
    id: school.id,
  });

  const canManage = role == "owner" || role == "admin";

  return (
    <div className="@container mx-auto flex w-full max-w-[120ch] flex-col gap-6 px-12 py-8">
      <div className="flex flex-1 flex-col gap-6 @4xl:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <h1 className="h1">{school.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="text-muted-foreground flex h-auto items-center gap-2 overflow-hidden text-xs"
              href={`https://www.google.com/maps?q=${school.name},${school.address},${school.city},${school.state},${school.zip}`}
              target="_blank"
            >
              <MapPin className="size-4 shrink-0" />
              <span className="truncate">
                {school.address}, {school.city}, {school.state} {school.zip}
              </span>
            </Button>
            <Button
              variant="outline"
              className="text-muted-foreground flex h-auto items-center gap-2 text-xs"
              href={school.canvasURL ?? ""}
              target="_blank"
            >
              <Circle className="size-4" />
              Canvas
            </Button>
            {canManage && (
              <Button
                variant="secondary"
                className="text-muted-foreground flex h-auto items-center gap-2 text-xs"
                href={`/app/schools/${school.id}/manage`}
              >
                <Settings className="size-4" />
                Manage
              </Button>
            )}
          </div>
          <div className="my-8 flex flex-col border-t border-b px-4 py-8">
            <span className="text-3xl font-bold">{members}</span>
            <span className="text-muted-foreground">students members</span>
          </div>
        </div>
        <div className="border-border flex h-96 flex-col gap-1 overflow-hidden rounded-xs border @4xl:flex-1">
          <span className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <MapIcon className="size-3" />
              Map Preview
            </div>
            <ResponsivePopover>
              <ResponsivePopoverTrigger asChild>
                <Button variant="link" className="h-auto p-0 text-xs">
                  Open <ExternalLink className="size-3" />
                </Button>
              </ResponsivePopoverTrigger>
              <ResponsivePopoverContent className="!z-[400]">
                <ResponsivePopoverHeader>
                  <ResponsivePopoverTitle>Open Map</ResponsivePopoverTitle>
                </ResponsivePopoverHeader>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="size-4 shrink-0" />
                    {school.address}, {school.city}, {school.state} {school.zip}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      href={`https://www.google.com/maps?q=${school.name},${school.address},${school.city},${school.state},${school.zip}`}
                      target="_blank"
                    >
                      Google Maps
                    </Button>
                    <Button
                      variant="outline"
                      href={`https://maps.apple.com/?q=${school.name},${school.address},${school.city},${school.state},${school.zip}&z=16`}
                      target="_blank"
                    >
                      Apple Maps
                    </Button>
                  </div>
                </div>
              </ResponsivePopoverContent>
            </ResponsivePopover>
          </span>
          <div className="stack flex-1">
            <div className="bg-secondary/50"></div>
            <Map coords={[school.lat ?? 0, school.long ?? 0]} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 @4xl:flex-row">
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between py-4">
            <h2 className="h3 mt-0">Periods</h2>
            {canManage && (
              <Button
                variant="link"
                href={`/app/schools/${school.id}/manage/periods`}
                className="text-muted-foreground px-0"
              >
                Manage
              </Button>
            )}
          </div>
          {periods
            ?.sort((a, b) => (a.periodOrder > b.periodOrder ? 1 : -1))
            ?.map((period) => (
              <div
                key={period.id}
                className="flex w-full items-center gap-2 border-t py-4"
              >
                <div className="flex w-full flex-col items-center gap-2">
                  <div className="flex w-full items-center justify-between gap-2">
                    <h3 className="font-bold">{period.name}</h3>
                    <p className="text-muted-foreground text-xs">
                      {(() => {
                        switch (period.type) {
                          case "single":
                            return "Single Selection";
                          case "course":
                            return "Course";
                          case "filler":
                            return "Empty";
                          default:
                            return "Unknown";
                        }
                      })()}
                    </p>
                  </div>
                  {period.options && (
                    <div className="ml-8 flex w-[calc(100%-theme(spacing.8))] flex-col gap-2">
                      {period.options?.map((option) => (
                        <div
                          key={option.id}
                          className="flex w-full items-center justify-between gap-2"
                        >
                          <span className="text-foreground/50 text-xs font-bold">
                            {option.name}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            Option
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between py-4">
            <h2 className="h3 mt-0">Schedules</h2>
            {canManage && (
              <Button
                variant="link"
                href={`/app/schools/${school.id}/manage/schedules`}
                className="text-muted-foreground px-0"
              >
                Manage
              </Button>
            )}
          </div>
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex w-full items-center justify-between gap-2 border-t py-4"
            >
              <h3 className="flex w-full items-center justify-between gap-2 font-bold">
                {schedule.name}
              </h3>
              <Button
                variant="link"
                size="sm"
                className="text-foreground/50"
                href={`/app/schools/${school.id}/schedules/${schedule.id}`}
              >
                View in Detail
              </Button>
            </div>
          ))}
          <div className="mt-4 flex items-center justify-between py-4">
            <h2 className="h3 mt-0">Schedules Dates</h2>
            {canManage && (
              <Button
                variant="link"
                href={`/app/schools/${school.id}/manage/schedules/dates`}
                className="text-muted-foreground px-0"
              >
                Manage
              </Button>
            )}
          </div>
          <CalendarView
            dates={dates}
            datesSchedule={datesSchedule}
            schedules={schedules}
          />
        </div>
      </div>
    </div>
  );
}
