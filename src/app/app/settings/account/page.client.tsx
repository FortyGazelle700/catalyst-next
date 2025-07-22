"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApiCtx } from "@/server/api";
import {
  ArrowRight,
  Gem,
  Info,
  ListTree,
  Lock,
  School,
  Trash,
  UserCircle,
  UserRoundPen,
} from "lucide-react";
import { type SetStateAction, type Dispatch } from "react";

export default function AccountSettings({
  settings,
  setLink,
  setSettings,
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
      <div className="flex flex-col gap-4 @2xl:flex-row">
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
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <UserRoundPen /> Public Profile
        </h2>
      </div>
      <div className="flex gap-4">
        <span className="text-muted-foreground flex w-full items-center justify-center py-8 text-xs">
          This feature is not available yet
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
          onClick={() => setLink("/upgrade")}
        >
          <div className="flex items-center gap-3">
            <Gem className="size-6" />
            <span>Upgrade to Pro</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/integration")}
        >
          <div className="flex items-center gap-3">
            <School className="size-6" />
            <span>School Integration</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/security")}
        >
          <div className="flex items-center gap-3">
            <Lock className="size-6" />
            <span>Security</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/destructive")}
        >
          <div className="flex items-center gap-3">
            <Trash className="size-6" />
            <span>Delete Account</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
