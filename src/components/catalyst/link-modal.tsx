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
import { ExternalLink, X } from "lucide-react";
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
}: {
  link: string;
  trigger: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  breadcrumbs: React.ReactNode;
  content: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const firstRender = useRef(true);

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
            setOpen(true);
          }}
        >
          {trigger}
        </Link>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent hiddenClose>
        <VisuallyHidden>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              {description}
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
        </VisuallyHidden>
        <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex flex-col items-center justify-start gap-2 border-b p-6 backdrop-blur md:flex-row">
          <Button variant="outline" onClick={() => setOpen(false)}>
            <X /> Close
          </Button>
          <Button href={link} target="_blank" variant="link">
            <ExternalLink /> Open in new tab
          </Button>
          {breadcrumbs}
        </div>
        <ErrorBoundary FallbackComponent={Error}>{Content}</ErrorBoundary>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
