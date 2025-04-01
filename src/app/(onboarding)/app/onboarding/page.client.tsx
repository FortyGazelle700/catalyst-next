"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPageClient({
  schools,
  settings: defaultSettings,
}: {
  schools: {
    id: string;
    name: string | null;
  }[];
  settings: Record<string, string>;
}) {
  const router = useRouter();

  const [settings, setSettings] =
    useState<Record<string, string>>(defaultSettings);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label className="text-xs text-muted-foreground flex-1">
          First Name
          <Input
            value={settings["f_name"]}
            onChange={(evt) => {
              setSettings({
                ...settings,
                ["f_name"]: evt.target.value,
              });
            }}
          />
        </label>
        <label className="text-xs text-muted-foreground flex-2">
          Last Name
          <Input
            value={settings["l_name"]}
            onChange={(evt) => {
              setSettings({
                ...settings,
                ["l_name"]: evt.target.value,
              });
            }}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <label className="text-xs text-muted-foreground w-[10ch]">
          Grade
          <Input
            type="number"
            min={0}
            max={12}
            value={settings["grade"]}
            onChange={(evt) => {
              setSettings({
                ...settings,
                ["grade"]: evt.target.value,
              });
            }}
          />
        </label>
        <label className="text-xs text-muted-foreground flex-1">
          School
          <Combobox
            emptyRender={<>No schools found</>}
            placeholders={{
              emptyValue: "Select a school...",
              search: "Search for a school...",
            }}
            defaultValue={settings["school_id"] ?? undefined}
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
                  render: school.name,
                })),
              },
            ]}
            afterRender={<></>}
          />
        </label>
      </div>
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          onClick={async () => {
            await fetch("/api/catalyst/settings/set-many", {
              method: "POST",
              body: JSON.stringify({
                settings: {
                  ...settings,
                },
              }),
            });
            router.push(
              `/app/onboarding/canvas?${new URLSearchParams(
                window.location.search
              ).toString()}`
            );
          }}
        >
          Save and Continue
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
