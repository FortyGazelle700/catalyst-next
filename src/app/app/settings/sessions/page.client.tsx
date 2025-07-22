"use client";

import { formatDuration } from "@/components/catalyst/format-duration";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiCtx } from "@/server/api";
import type { SessionResult } from "@/server/api/catalyst/account/sessions/list";
import { Temporal } from "@js-temporal/polyfill";
import {
  ArrowRight,
  Dot,
  ListTree,
  Loader,
  Lock,
  Monitor,
  MonitorSmartphone,
  Smartphone,
  Trash,
  UserCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

export default function GeneralSettings({
  setLink,
}: {
  link: string;
  setLink: (link: string) => void;
  settings: ApiCtx["user"]["settings"];
  setSettings: (settings: ApiCtx["user"]["settings"]) => void;
}) {
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/catalyst/account/sessions/list");

      if (!res.ok) {
        console.error("Failed to fetch sessions");
        return;
      }

      const data = (await res.json()) as {
        success: boolean;
        data: SessionResult[];
        errors: { message: string }[];
      };

      if (data.success) {
        setSessions(data.data);
      } else {
        console.error("Error fetching sessions:", data.errors);
      }
      setLoading(false);
    })().catch(console.error);
  }, []);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <MonitorSmartphone /> Active Sessions
        </h2>
      </div>
      <div className="@container flex flex-col gap-2">
        {loading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-20.5 w-full rounded-md" />
            ))}
          </>
        ) : (
          <>
            {sessions
              ?.sort((a, b) =>
                new Date(a.lastAccessed ?? "").getTime() <
                new Date(b.lastAccessed ?? "").getTime()
                  ? -1
                  : 1,
              )
              ?.sort((a, b) => (a.isCurrent && !b.isCurrent ? -1 : 1))
              ?.map((session) => (
                <div
                  key={new Date(session.expires).getTime()}
                  className="flex flex-col items-center justify-between gap-4 rounded-lg border p-4 @lg:gap-6 @2xl:flex-row"
                >
                  <div className="mx-auto flex flex-col items-center gap-3 @lg:ml-0 @lg:flex-row">
                    <div className="bg-muted rounded-full p-3">
                      {UAParser(session.userAgent ?? "").device.is("mobile") ? (
                        <Smartphone className="size-4" />
                      ) : (
                        <Monitor className="size-4" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 @md:gap-0">
                      <span className="flex items-center">
                        <span className="font-bold">
                          {UAParser(
                            session.userAgent ?? "",
                          ).device.toString() == "undefined"
                            ? "Unknown Device"
                            : UAParser(
                                session.userAgent ?? "",
                              ).device.toString()}
                        </span>
                      </span>
                      <span className="text-muted-foreground flex flex-col items-center text-xs @md:flex-row">
                        <span>
                          {UAParser(session.userAgent ?? "").os.toString() ==
                          "undefined"
                            ? "Unknown OS"
                            : UAParser(session.userAgent ?? "").os.toString()}
                        </span>
                        <Dot />
                        <span>
                          {UAParser(session.userAgent ?? "")
                            .browser.toString()
                            .replace(/\.$/, "") == "undefined"
                            ? "Unknown Browser"
                            : UAParser(session.userAgent ?? "")
                                .browser.toString()
                                .replace(/\.$/, "")}
                        </span>
                        <Dot />
                        <span>{session.sessionToken.substring(0, 8)}</span>
                        {session.country && (
                          <>
                            <Dot />
                            <span>
                              {session.city && `${session.city}, `}
                              {session.region && `${session.region}, `}
                              {session.country}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-muted-foreground flex flex-col items-end gap-1 text-xs">
                      {session.isCurrent && <Badge>Current Session</Badge>}
                      Last active{" "}
                      {formatDuration(
                        Temporal.Instant.from(
                          session.lastAccessed?.toString() ?? "",
                        ).until(Temporal.Now.instant()),
                        {
                          maxUnit: "month",
                          minUnit: "second",
                          maxUnits: 1,
                          hideUnnecessaryUnits: true,
                          style: "short",
                        },
                      )}{" "}
                      ago
                    </span>
                    <Button
                      variant="destructive"
                      className="size-10"
                      disabled={revoking.includes(session.sessionToken)}
                      onClick={async () => {
                        setRevoking((prev) => [...prev, session.sessionToken]);
                        const req = await fetch(
                          `/api/catalyst/account/sessions/revoke?id=${session.sessionToken}`,
                          {
                            method: "DELETE",
                          },
                        );
                        if (!req.ok) {
                          console.error("Failed to revoke session");
                          return;
                        }
                        const data = (await req.json()) as {
                          success: boolean;
                          data: string[];
                          errors: { message: string }[];
                        };
                        if (data.success) {
                          setSessions((prev) =>
                            prev.filter(
                              (s) => s.sessionToken !== session.sessionToken,
                            ),
                          );
                          if (session.isCurrent) {
                            await signOut();
                          }
                        } else {
                          console.error(
                            "Failed to delete session:",
                            data.errors,
                          );
                        }
                        setRevoking((prev) =>
                          prev.filter((s) => s != session.sessionToken),
                        );
                      }}
                    >
                      {revoking.includes(session.sessionToken) ? (
                        <Loader className="size-4 animate-spin" />
                      ) : (
                        <Trash className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
          </>
        )}
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
