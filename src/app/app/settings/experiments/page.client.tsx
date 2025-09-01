"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ApiCtx } from "@/server/api";
import { ArrowRight, Gem, Info, ListTree, Wrench } from "lucide-react";
import { type SetStateAction, type Dispatch } from "react";

export default function ExperimentsSettings({
  setLink,
}: {
  link: string;
  setLink: Dispatch<SetStateAction<string>>;
  settings: ApiCtx["user"]["settings"];
  setSettings: Dispatch<SetStateAction<ApiCtx["user"]["settings"]>>;
  isPro: boolean;
}) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <Wrench /> Tweaks
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <label className="text-muted-foreground flex w-full items-center justify-between gap-2 rounded-full border px-4 py-2">
          <span>Notifications</span>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>Not available yet</span>
            </span>
            <Switch disabled />
          </div>
        </label>
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
