"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Info,
  Loader,
  RotateCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimationPlayer } from "@/components/catalyst/animation-player";

export default function OnboardingPageClient({
  tokenIsSaved: defaultTokenIsSaved,
  canvasUrl,
}: {
  tokenIsSaved: boolean;
  canvasUrl: string;
}) {
  const router = useRouter();

  const [tokenIsSaved, setTokenIsSaved] = useState(defaultTokenIsSaved);
  const [token, setToken] = useState<string>("");

  const [saving, setSaving] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-col">
        <label className="text-xs text-muted-foreground flex-1">
          Canvas Token
          <Input
            value={
              tokenIsSaved
                ? "10968~hatU3zFhYaCCYAE2BaANYnBxKhaZrNNFvLCtyyErfXKytzVxuAAeHCc9NtHD2zxe"
                : token
            }
            onChange={(evt) => {
              setToken(evt.target.value);
            }}
            placeholder="10968~hatU3zFhYaCCYAE2BaANYnBxKhaZrNNFvLCtyyErfXKytzVxuAAeHCc9NtHD2zxe"
            disabled={tokenIsSaved}
            readOnly={tokenIsSaved}
            className="text-foreground"
          />
          <div className="flex items-center justify-between md:flex-row flex-col gap-2 mt-1">
            {tokenIsSaved ? (
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 text-xs px-2">
                <Info className="size-4 mt-0.5 flex-shrink-0" />
                <span>
                  This is not your actual token, your token is saved, but if you
                  need to change it, you can reroll it.
                </span>
              </div>
            ) : (
              <span></span>
            )}
            <Button
              onClick={() => {
                setTokenIsSaved(false);
              }}
              variant="link"
              className="text-xs"
              disabled={!tokenIsSaved}
            >
              <RotateCw className="size-3" /> Reroll Token
            </Button>
          </div>
        </label>
        <div className="relative">
          <AnimationPlayer
            src="/canvas.lottie.json"
            autoplay
            loop
            className="border rounded-md overflow-hidden"
          />
          <Button
            href={canvasUrl}
            target="_blank"
            variant="secondary"
            className="absolute top-2 right-2"
          >
            Open Canvas <ExternalLink />
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={async () => {
            router.push(
              `/app/onboarding?${new URLSearchParams(
                window.location.search
              ).toString()}`
            );
          }}
        >
          <ArrowLeft /> Back
        </Button>
        <Button
          onClick={async () => {
            setSaving(true);
            if (!tokenIsSaved) {
              await fetch("/api/catalyst/settings/set-many", {
                method: "POST",
                body: JSON.stringify({
                  settings: {
                    canvas_token: token,
                  },
                }),
              });
            }
            router.push(
              `/app/onboarding/schedule?${new URLSearchParams(
                window.location.search
              ).toString()}`
            );
          }}
          disabled={saving || (!tokenIsSaved && !token)}
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
  );
}
