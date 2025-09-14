"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Loader,
  RotateCw,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CanvasTutorial } from "@/components/catalyst/canvas-tutorial";

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

  const [tokenState, setTokenState] = useState<"success" | "error" | "pending">(
    "pending",
  );

  useEffect(() => {
    setTokenState("pending");

    const request = async () => {
      const req = await fetch("/api/verify-token", {
        method: "POST",
        body: JSON.stringify({ token: token }),
      });
      if (req.status == 200) {
        setTokenState("success");
      } else {
        setTokenState("error");
      }
    };

    const debouncer = setTimeout(() => {
      request().catch(console.error);
    }, 1000);

    return () => {
      clearTimeout(debouncer);
    };
  }, [token]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label className="text-muted-foreground flex-1 text-xs">
          Canvas Token
          <Input
            value={
              tokenIsSaved
                ? "10968~hatU3zFhYaCCYAE2BaANYnBxKHaZrNNFvLCtyyErfXKytzVxuAAeHCc9NtHD2zxe"
                : token
            }
            onChange={(evt) => {
              setToken(evt.target.value);
            }}
            placeholder="10968~hatU3zFhYaCCYAE2BaANYnBxKHaZrNNFvLCtyyErfXKytzVxuAAeHCc9NtHD2zxe"
            disabled={tokenIsSaved}
            readOnly={tokenIsSaved}
            className="text-foreground"
          />
          <div className="mt-1 flex flex-col items-center justify-between gap-2 md:flex-row">
            {(tokenIsSaved ?? true) ? (
              <div className="flex items-center gap-1 px-2 text-xs text-yellow-600 dark:text-yellow-500">
                <Info className="mt-0.5 size-4 shrink-0" />
                <span>
                  This is not your actual token, your token is saved, but if you
                  need to change it, you can reroll it.
                </span>
              </div>
            ) : (
              <span className="flex items-center gap-1">
                {(() => {
                  switch (tokenState) {
                    case "pending":
                      return (
                        <>
                          <Loader className="size-3 animate-spin" />{" "}
                          Verifying...
                        </>
                      );
                    case "error":
                      return (
                        <>
                          <X className="size-3" /> Failed
                        </>
                      );
                    case "success":
                      return (
                        <>
                          <Check className="size-3" /> Verified
                        </>
                      );
                  }
                })()}
              </span>
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
        <CanvasTutorial canvasUrl={canvasUrl} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={async () => {
            router.push(
              `/app/onboarding?${new URLSearchParams(
                window.location.search,
              ).toString()}`,
            );
          }}
        >
          <ArrowLeft /> Back
        </Button>
        <Button
          onClick={async () => {
            setSaving(true);
            if (!tokenIsSaved) {
              await fetch("/api/catalyst/account/settings/set-many", {
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
                window.location.search,
              ).toString()}`,
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
