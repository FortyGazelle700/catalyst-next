"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPageClient({
  tokenIsSaved,
}: {
  tokenIsSaved: boolean;
}) {
  const router = useRouter();

  const [token, setToken] = useState<string>("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label className="text-xs text-muted-foreground flex-1">
          Canvas Token
          <Input
            value={token}
            onChange={(evt) => {
              setToken(evt.target.value);
            }}
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
                  canvas_token: token,
                },
              }),
            });
            router.push(
              `/app/onboarding/schedule?${new URLSearchParams(
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
