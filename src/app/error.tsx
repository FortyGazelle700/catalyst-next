"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { Ban, Home, LogOut, RotateCcw } from "lucide-react";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
  resetErrorBoundary,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  resetErrorBoundary?: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <div className="max-h-full flex flex-col">
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
        <div className="mt-4 flex gap-4 items-center">
          <Button onClick={() => reset?.() || resetErrorBoundary?.()}>
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
