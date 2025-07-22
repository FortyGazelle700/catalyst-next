"use client";

import { Button } from "@/components/ui/button";
import type { ApiCtx } from "@/server/api";
import {
  ArrowRight,
  DollarSign,
  Gem,
  ListTree,
  UserCircle,
} from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

export default function GeneralSettings({
  setLink,
}: {
  link: string;
  setLink: Dispatch<SetStateAction<string>>;
  settings: ApiCtx["user"]["settings"];
  setSettings: Dispatch<SetStateAction<ApiCtx["user"]["settings"]>>;
}) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <Gem /> Pro Status
        </h2>
      </div>
      <div className="flex gap-4">
        <span className="text-muted-foreground flex w-full items-center justify-center py-8 text-xs">
          Pro is not available yet
        </span>
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <DollarSign /> Plans
        </h2>
      </div>
      <div className="flex gap-4">
        <span className="text-muted-foreground flex w-full items-center justify-center py-8 text-xs">
          Pro is not available yet
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
          onClick={() => setLink("/account")}
        >
          <div className="flex items-center gap-3">
            <UserCircle className="size-6" />
            <span>Account</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
