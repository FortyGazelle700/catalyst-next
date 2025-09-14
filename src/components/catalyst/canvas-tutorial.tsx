"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { AnimationPlayer } from "./animation-player";
import { useEffect, useState } from "react";
import { type ILottie } from "@lottielab/lottie-player/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CanvasTutorial({ canvasUrl }: { canvasUrl: string }) {
  const [time, setTime] = useState(0);
  const [lottie, setLottie] = useState<ILottie | undefined>(undefined);

  const forceSetTime = (newTime: number) => {
    if (lottie) {
      lottie.currentTime = newTime;
      setTime(newTime);
    }
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      setTime(lottie?.currentTime ?? 0);
    };

    lottie?.on("time", handleTimeUpdate);

    return () => {
      lottie?.off("time", handleTimeUpdate);
    };
  }, [lottie]);

  const steps = [
    {
      description: "Open your Canvas Dashboard",
      timeStart: 0.0,
    },
    {
      description: "Open your account sidebar",
      timeStart: 1.5,
    },
    {
      description: 'Click "Settings"',
      timeStart: 3.4,
    },
    {
      description:
        'Scroll to bottom of approved integrations; Find "New Access Token"',
      timeStart: 5.0,
    },
    {
      description:
        "<wbr/>Enter [Purpose: Catalyst] <wbr/>[Expires: Never (blank)]",
      timeStart: 6.9,
    },
    {
      description: 'Click "Generate Token"',
      timeStart: 8.6,
    },
    {
      description:
        'Copy the token and paste into Catalyst (the field "Canvas Token")',
      timeStart: 10.0,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <AnimationPlayer
          src="/canvas.lottie.json"
          autoplay
          loop
          className="overflow-hidden rounded-md border"
          speed={0.3}
          setLottie={setLottie}
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
      <RotatingMessages
        steps={steps}
        time={time}
        forceSetTime={forceSetTime}
        className="w-full"
      />
    </div>
  );
}

interface Step {
  description: string;
  timeStart: number;
}

interface RotatingMessagesProps {
  steps: Step[];
  time?: number;
  className?: string;
  forceSetTime?: (newTime: number) => void;
}

function RotatingMessages({
  steps,
  time = 2000,
  forceSetTime,
  className,
}: RotatingMessagesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentStep = steps.find((step, index) => {
    const nextStep = steps[index + 1];
    return nextStep
      ? time >= step.timeStart && time < nextStep.timeStart
      : time >= step.timeStart;
  });

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex h-12 items-center justify-between rounded-lg border py-2 pl-6">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStep?.description}
              initial={{ opacity: 0, filter: "blur(4px)", top: 4 }}
              animate={{ opacity: 1, filter: "blur(0px)", top: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)", top: -4 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="relative w-full flex-1 overflow-hidden font-medium"
            >
              <div
                className="h-[1.6em] w-full truncate"
                dangerouslySetInnerHTML={{
                  __html: currentStep?.description ?? "",
                }}
              />
            </motion.span>
          </AnimatePresence>
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mr-1 ml-4 shrink-0"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-card space-y-2 rounded-lg border p-4">
              <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                All Steps
              </h3>
              {steps.map((step, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground flex h-auto w-full items-center justify-between rounded-md border border-transparent px-4 py-2 transition-all",
                    index === steps.indexOf(currentStep!)
                      ? "bg-primary/10 border-primary/20"
                      : time >= step.timeStart
                        ? "bg-muted/30"
                        : "opacity-50",
                  )}
                  onClick={() => forceSetTime?.(step.timeStart)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        index === steps.indexOf(currentStep!)
                          ? "bg-primary animate-pulse"
                          : time >= step.timeStart
                            ? "bg-green-500"
                            : "bg-muted-foreground",
                      )}
                    />
                    <div
                      className="w-full flex-1 text-left text-sm text-wrap"
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                  </div>
                  <span className="text-muted-foreground ml-8 text-xs">
                    {Math.floor(step.timeStart)}s
                  </span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
