"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Ban, Home, LogOut, RotateCcw } from "lucide-react";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
  resetErrorBoundary,
  className,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  resetErrorBoundary?: () => void;
  className?: string;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <div className={cn("flex max-h-full flex-col", className)}>
      <div className="mt-16 flex flex-col items-start justify-center gap-2 px-32 py-16">
        <Ban className="size-16" />
        <h1 className="h1">Hmm, An Application Error Occurred</h1>
        <p className="text-muted-foreground">
          Hmm, it seems like a client-side error occurred. Please try again
          later.
          <br />
          This error should already be reported to the support team.
          <br />
          If the problem persists, please report the issue as a bug.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Button onClick={() => reset?.() ?? resetErrorBoundary?.()}>
            <RotateCcw /> Retry
          </Button>
          <Button variant="secondary" href="/app">
            <Home /> Visit Dashboard
          </Button>
          <Button variant="secondary" href="/home">
            <LogOut /> Exit App
          </Button>
        </div>
      </div>
    </div>
  );
}
