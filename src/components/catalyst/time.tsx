"use client";

import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

export function Time({
  selected,
  onSelect,
  includeSeconds = false,
}: {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  includeSeconds?: boolean;
}) {
  const [time24h, setTime24h] = useState<boolean | undefined>(undefined);
  const [isPm, setIsPm] = useState(false);

  useEffect(() => {
    if (selected) {
      setIsPm(selected.getHours() >= 12);
    }
  }, [selected]);

  useEffect(() => {
    setTime24h(localStorage.getItem("time24h") == "true");
  }, []);

  useEffect(() => {
    if (time24h != undefined) {
      localStorage.setItem("time24h", time24h.toString());
    }
  }, [time24h]);

  return (
    <div className="flex flex-col gap-2 w-full max-h-full">
      <div className="flex gap-2 items-center justify-between pl-0 p-4">
        <h2 className="text-muted-foreground">Time</h2>
        <label className="flex gap-2 text-xs items-center">
          <span>12h</span>
          <Switch checked={!!time24h} onCheckedChange={setTime24h} />
          <span>24h</span>
        </label>
      </div>
      <div className="flex gap-2 flex-1 max-h-64">
        <div className="flex flex-col gap-1 max-h-full overflow-auto flex-1">
          {Array.from({ length: time24h ? 24 : 12 })
            .map((_, i) => i + (time24h ? 0 : 1))
            .sort((a, b) => (!time24h && a == 12 ? -1 : a - b ? 1 : -1))
            .map((hr) => (
              <Button
                className="flex-1"
                key={hr}
                variant={
                  (selected?.getHours() ?? 0) % (time24h ? 24 : 12) ==
                  (!time24h && hr == 12 ? 0 : hr)
                    ? "secondary"
                    : "outline"
                }
                onClick={() => {
                  const date = new Date(selected ?? new Date());
                  date.setHours(hr + (isPm && !time24h ? 12 : 0));
                  onSelect(date);
                }}
              >
                {hr.toString().padStart(time24h ? 2 : 1, "0")}
              </Button>
            ))}
        </div>
        <div className="flex flex-col gap-1 max-h-full overflow-auto flex-1">
          {Array.from({ length: 60 })
            .map((_, i) => i)
            .map((min) => (
              <Button
                className="flex-1"
                key={min}
                variant={
                  (selected?.getMinutes() ?? 0) == min ? "secondary" : "outline"
                }
                onClick={() => {
                  const date = new Date(selected ?? new Date());
                  date.setMinutes(min);
                  onSelect(date);
                }}
              >
                {min.toString().padStart(2, "0")}
              </Button>
            ))}
        </div>
        {includeSeconds && (
          <div className="flex flex-col gap-1 max-h-full overflow-auto flex-1">
            {Array.from({ length: 60 })
              .map((_, i) => i)
              .map((sec) => (
                <Button
                  className="flex-1"
                  key={sec}
                  variant={
                    (selected?.getSeconds() ?? 0) == sec
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() => {
                    const date = new Date(selected ?? new Date());
                    date.setSeconds(sec);
                    onSelect(date);
                  }}
                >
                  {sec.toString().padStart(2, "0")}
                </Button>
              ))}
          </div>
        )}
        {!time24h && (
          <div className="flex flex-col gap-1 max-h-full overflow-auto flex-1">
            <Button
              className="flex-1"
              variant={!isPm ? "secondary" : "outline"}
              onClick={() => {
                setIsPm(false);
                const date = new Date(selected ?? new Date());
                date.setHours(date.getHours() % 12);
                onSelect(date);
              }}
            >
              AM
            </Button>
            <Button
              className="flex-1"
              variant={isPm ? "secondary" : "outline"}
              onClick={() => {
                setIsPm(true);
                const date = new Date(selected ?? new Date());
                date.setHours((date.getHours() % 12) + 12);
                onSelect(date);
              }}
            >
              PM
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
