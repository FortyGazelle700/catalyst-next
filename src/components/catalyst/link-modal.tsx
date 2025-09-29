"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "./responsible-modal";
import { VisuallyHidden } from "../ui/visually-hidden";
import { ExternalLink, Maximize2, X } from "lucide-react";
import Link from "next/link";
import { ErrorBoundary } from "react-error-boundary";
import Error from "@/app/error";

export function LinkModal({
  link,
  trigger,
  title,
  description,
  breadcrumbs,
  content,
  stopPropagation = false,
  onOpenChange,
}: {
  link: string;
  trigger: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  breadcrumbs: React.ReactNode;
  content: React.ReactNode;
  stopPropagation?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (onOpenChange) onOpenChange(open);
  }, [open, onOpenChange]);

  const Content = useMemo(() => {
    return content;
  }, [content]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (open) {
      const url = new URL(window.location.href);
      url.searchParams.set("modal", link);
      window.history.replaceState(null, "", url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("modal");
      window.history.replaceState(null, "", url.toString());
    }
  }, [link, open]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("modal") == link) {
      setOpen(true);
    }
  }, [link]);

  return (
    <ResponsiveModal open={open} onOpenChange={(open) => setOpen(open)}>
      <ResponsiveModalTrigger asChild>
        <Link
          href={link}
          onClick={(evt) => {
            evt.preventDefault();
            if (stopPropagation) evt.stopPropagation();
            setOpen(true);
          }}
        >
          {trigger}
        </Link>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent hiddenClose className="@container">
        <VisuallyHidden>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              {description}
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
        </VisuallyHidden>
        <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex w-[calc(100cqw+theme(spacing.2))] flex-col items-center justify-start gap-6 border-b p-6 backdrop-blur md:!w-[calc(100cqw+theme(spacing.12))] md:flex-row md:gap-2">
          <div className="flex w-full items-center justify-between gap-2 md:w-auto">
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X /> Close
            </Button>
            <div className="flex h-9 shrink-0 items-center overflow-hidden rounded-full border text-sm">
              <Link
                href={link}
                className="hover:bg-accent hover:text-accent-foreground flex h-full items-center gap-2 px-4 py-2 transition-all"
              >
                <Maximize2 className="size-3" /> Open
              </Link>
              <div className="bg-border h-full w-px" />
              <Link
                href={link}
                target="_blank"
                className="hover:bg-accent hover:text-accent-foreground flex h-full items-center gap-2 px-4 py-2 transition-all"
              >
                <ExternalLink className="size-3" /> New Tab
              </Link>
            </div>
          </div>
          <div className="w-[calc(100vw-theme(spacing.8))] flex-1 overflow-auto pl-2">
            <span>{breadcrumbs}</span>
          </div>
        </div>
        <ErrorBoundary FallbackComponent={Error}>{Content}</ErrorBoundary>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
