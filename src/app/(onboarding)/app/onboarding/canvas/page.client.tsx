"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Ref, RefObject, useEffect, useRef, useState } from "react";
import Lottie, { ILottie } from '@lottielab/lottie-player/react';

export default function OnboardingPageClient({
  tokenIsSaved,
}: {
  tokenIsSaved: boolean;
}) {
  const router = useRouter();

  const [token, setToken] = useState<string>("");

  const lottie = useRef(undefined) as unknown as RefObject<HTMLDivElement> | undefined;

  let removed = 0;
  const MAX_REMOVE = 1000;

  const toRemove = setInterval(() => {
    const el = lottie?.current?.querySelector("svg > g > g:has(g > g[opacity=\"0.8\"])");
    el?.remove();

    removed++;
    if (removed >= MAX_REMOVE) {
      clearInterval(toRemove);
    }
  }, 10);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-col">
        <label className="text-xs text-muted-foreground flex-1">
          Canvas Token
          <Input
            value={token}
            onChange={(evt) => {
              setToken(evt.target.value);
            }}
          />
        </label>
        <div className="bg-white render-white-content" ref={lottie}>
          <Lottie src="/canvas.lottie.json" autoplay loop />
        </div>
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
