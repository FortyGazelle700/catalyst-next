"use client";

import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTitle,
  ResponsivePopoverTrigger,
} from "@/components/catalyst/responsible-popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WheelPicker, WheelPickerWrapper } from "@/components/ui/wheel-picker";
import {
  ArrowLeft,
  ArrowRight,
  ChevronsUpDown,
  DoorOpen,
  Info,
  Loader,
  LogOut,
  Plus,
  RotateCcw,
  School,
  Trash,
  User,
  UserCircle,
  X,
  Lock,
  Pencil,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const options = [
  {
    label: "Kindergarten",
    value: "0",
  },
  ...Array.from({ length: 12 }, (_, i) => i + 1).map((v) => ({
    label: `Grade ${v.toString()}`,
    value: v.toString(),
  })),
  {
    label: "College and Beyond",
    value: "13",
  },
];

export default function OnboardingPageClient({
  schools,
  settings: defaultSettings,
}: {
  schools: {
    id: string;
    name: string | null;
    district: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    canvasURL: string | null;
    isPublic: boolean | null;
    isComplete: boolean | null;
  }[];
  settings: Record<string, string>;
}) {
  const router = useRouter();

  const [settings, setSettings] =
    useState<Record<string, string>>(defaultSettings);

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem(
      "catalyst-onboarding-settings",
      JSON.stringify({ ...settings, email: undefined }),
    );
  }, [settings]);

  useEffect(() => {
    const storedSettings = localStorage.getItem("catalyst-onboarding-settings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings) as Record<string, string>);
    }
  }, []);

  const [saving, setSaving] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <UserCircle /> Contact Information
        </h2>
      </div>
      <div className="flex gap-4">
        <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
          Email
          <Input value={settings.email} readOnly />
          <div className="flex items-center gap-1 px-2 text-xs text-yellow-600 dark:text-yellow-500">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              Information populated by Google. This information cannot be
              changed.
            </span>
          </div>
        </label>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <label className="text-muted-foreground flex flex-1 flex-col gap-1 text-xs">
          First Name
          <Input
            placeholder="John"
            className="text-foreground"
            value={settings.f_name ?? ""}
            onChange={(evt) => {
              setSettings({
                ...settings,
                ["f_name"]: evt.target.value,
              });
            }}
          />
        </label>
        <label className="text-muted-foreground flex flex-2 flex-col gap-1 text-xs">
          Last Name
          <Input
            placeholder="Doe"
            className="text-foreground"
            value={settings.l_name ?? ""}
            onChange={(evt) => {
              setSettings({
                ...settings,
                ["l_name"]: evt.target.value,
              });
            }}
          />
        </label>
      </div>
      <div>
        <h2 className="mt-4 flex items-center gap-2 font-bold">
          <School /> Academic Information
        </h2>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <label className="text-muted-foreground flex flex-col gap-1 text-xs lg:w-[25ch]">
          Grade
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="dark:bg-input/30 flex w-full justify-between"
              >
                <span>
                  {options.find((option) => option.value === settings.grade)
                    ?.label ?? "Select a grade..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <WheelPickerWrapper>
                <WheelPicker
                  options={options}
                  value={settings.grade ?? "0"}
                  onValueChange={(val) =>
                    setSettings({
                      ...settings,
                      ["grade"]: val,
                    })
                  }
                />
              </WheelPickerWrapper>
            </PopoverContent>
          </Popover>
        </label>
        <label className="text-muted-foreground flex flex-1 flex-col gap-1 text-xs">
          School
          <Combobox
            emptyRender={
              <div className="pointer-events-none relative -mb-16 flex h-32 w-full flex-col items-center justify-center">
                <div className="flex-1">
                  <div className="h3">No schools found</div>
                  <div className="text-muted-foreground text-sm">
                    Try adjusting your search or adding a new school.
                  </div>
                </div>
              </div>
            }
            placeholders={{
              emptyValue: "Select a school...",
              search: "Search for a school...",
            }}
            defaultValue={settings.school_id ?? undefined}
            onSelect={(value) => {
              setSettings({
                ...settings,
                ["school_id"]: value,
              });
            }}
            className="w-full"
            groups={[
              {
                id: "schools",
                header: "",
                values: schools.map((school) => ({
                  id: school.id,
                  render: (
                    <div className="flex w-full items-center justify-between">
                      <span>{school.name}</span>
                      <div>
                        {school.isComplete ? (
                          <></>
                        ) : (
                          <Badge variant="destructive">
                            <X />
                            Incomplete
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {school.isPublic ? (
                            <>
                              <User /> Public
                            </>
                          ) : (
                            <>
                              <Lock />
                              Private
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  ),
                })),
              },
            ]}
            afterRender={
              <div className="flex w-full items-center justify-end p-2">
                <Button href="/app/onboarding/school">
                  <Plus /> Add School
                </Button>
              </div>
            }
          />
        </label>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 sm:items-center">
        <ResponsivePopover>
          <ResponsivePopoverTrigger asChild>
            <Button variant="outline">
              <ArrowLeft />
              Back
            </Button>
          </ResponsivePopoverTrigger>
          <ResponsivePopoverContent className="@container w-84 md:w-52">
            <ResponsivePopoverTitle className="mb-4 text-center">
              Are you sure you want to cancel?
            </ResponsivePopoverTitle>
            <div className="mx-auto flex flex-col gap-2">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  setSettings(defaultSettings);
                  localStorage.removeItem("catalyst-onboarding-settings");
                }}
              >
                <RotateCcw /> Reset
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  router.push(`/home`);
                }}
              >
                <DoorOpen /> Exit
              </Button>
              <Button
                className="justify-start"
                variant="secondary"
                onClick={async () => {
                  await signOut({
                    redirectTo: "/home",
                  });
                }}
              >
                <LogOut /> Log Out
              </Button>
              <Button
                className="justify-start"
                variant="destructive"
                onClick={async () => {
                  await fetch("/api/catalyst/account/delete", {
                    method: "DELETE",
                  });
                  localStorage.clear();
                  await signOut({
                    redirectTo: "/app/auth",
                  });
                }}
              >
                <Trash /> Delete Account
              </Button>
            </div>
          </ResponsivePopoverContent>
        </ResponsivePopover>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          {!schools.find((s) => s.id === settings.school_id)?.isPublic && (
            <>
              <Button
                variant="secondary"
                href={`/app/onboarding/school?${new URLSearchParams(
                  window.location.search,
                ).toString()}`}
              >
                Modify School <Pencil />
              </Button>
            </>
          )}
          <Button
            onClick={async () => {
              setSaving(true);
              await fetch("/api/catalyst/account/settings/set-many", {
                method: "POST",
                body: JSON.stringify({
                  settings: {
                    ...settings,
                  },
                }),
              });
              if (
                !schools.find((s) => s.id === settings.school_id)?.isComplete
              ) {
                router.push(
                  `/app/onboarding/school/periods?${new URLSearchParams(
                    window.location.search,
                  ).toString()}`,
                );
                return;
              }
              router.push(
                `/app/onboarding/canvas?${new URLSearchParams(
                  window.location.search,
                ).toString()}`,
              );
            }}
            disabled={
              saving ||
              !settings.school_id ||
              !settings.grade ||
              !settings.f_name ||
              !settings.l_name
            }
          >
            {saving ? (
              <>
                Saving... <Loader className="animate-spin" />
              </>
            ) : (
              <>
                Save and Continue
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
