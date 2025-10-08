"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/components/util/hooks";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PopoverClose } from "@radix-ui/react-popover";

interface BaseProps {
  children: React.ReactNode;
}

interface RootResponsivePopoverProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ResponsivePopoverProps extends BaseProps {
  className?: string;
  asChild?: true;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  sideDistance?: number;
  alignDistance?: number;
}

const ResponsivePopoverContext = React.createContext<{ isDesktop: boolean }>({
  isDesktop: false,
});

const useResponsivePopoverContext = () => {
  const context = React.useContext(ResponsivePopoverContext);
  if (!context) {
    throw new Error(
      "ResponsivePopover components cannot be rendered outside the ResponsivePopover Context",
    );
  }
  return context;
};

const ResponsivePopover = ({
  children,
  mode = "auto",
  ...props
}: RootResponsivePopoverProps & { mode: "drawer" | "popover" | "auto" }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  let ResponsiveComponent: React.ElementType;
  if (mode === "auto") {
    ResponsiveComponent = isDesktop ? Popover : Drawer;
  } else if (mode === "popover") {
    ResponsiveComponent = Popover;
  } else {
    ResponsiveComponent = Drawer;
  }

  // For context, treat isDesktop as true if mode is popover, false if drawer, else use media query
  const contextIsDesktop = mode === "auto" ? isDesktop : mode === "popover";

  return (
    <ResponsivePopoverContext.Provider
      value={{ isDesktop: !!contextIsDesktop }}
    >
      <ResponsiveComponent
        {...props}
        {...(ResponsiveComponent === Drawer ? { autoFocus: true } : {})}
      >
        {children}
      </ResponsiveComponent>
    </ResponsivePopoverContext.Provider>
  );
};

const ResponsivePopoverTrigger = ({
  className,
  children,
  ...props
}: ResponsivePopoverProps) => {
  const { isDesktop } = useResponsivePopoverContext();
  const ResponsiveTrigger = isDesktop ? PopoverTrigger : DrawerTrigger;

  return (
    <ResponsiveTrigger className={className} {...props}>
      {children}
    </ResponsiveTrigger>
  );
};

const ResponsivePopoverClose = ({
  className,
  children,
  ...props
}: ResponsivePopoverProps) => {
  const { isDesktop } = useResponsivePopoverContext();
  const ResponsiveClose = isDesktop ? PopoverClose : DrawerClose;

  return (
    <ResponsiveClose className={className} {...props}>
      {children}
    </ResponsiveClose>
  );
};

const ResponsivePopoverContent = ({
  className,
  children,
  ...props
}: ResponsivePopoverProps) => {
  const { isDesktop } = useResponsivePopoverContext();
  const ResponsiveContent = isDesktop ? PopoverContent : DrawerContent;

  return (
    <ResponsiveContent
      className={cn(
        !isDesktop && "w-[min(100ch,100%)]",
        isDesktop && "w-[min(100ch,calc(100%-2rem))]",
        className,
      )}
      {...props}
    >
      {children}
    </ResponsiveContent>
  );
};

const ResponsivePopoverDescription = ({
  className,
  children,
  ...props
}: ResponsivePopoverProps) => {
  const { isDesktop } = useResponsivePopoverContext();
  const ResponsiveDescription = isDesktop
    ? (_: unknown) => null
    : DrawerDescription;

  return (
    <ResponsiveDescription className={className} {...props}>
      {children}
    </ResponsiveDescription>
  );
};

const ResponsivePopoverHeader = ({
  className,
  children,
  ...props
}: ResponsivePopoverProps) => {
  const { isDesktop } = useResponsivePopoverContext();
  const ResponsiveHeader = isDesktop ? (_: unknown) => null : DrawerHeader;

  return (
    <ResponsiveHeader className={className} {...props}>
      {children}
    </ResponsiveHeader>
  );
};

const ResponsivePopoverTitle = ({
  className,
  children,
  ...props
}: ResponsivePopoverProps) => {
  const { isDesktop } = useResponsivePopoverContext();
  const ResponsiveTitle = isDesktop ? (_: unknown) => null : DrawerTitle;

  return (
    <ResponsiveTitle className={className} {...props}>
      {children}
    </ResponsiveTitle>
  );
};

const ResponsivePopoverBody = ({
  className,
  children,
  ...props
}: ResponsivePopoverProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

const ResponsivePopoverFooter = ({
  className,
  children,
  ...props
}: ResponsivePopoverProps) => {
  const { isDesktop } = useResponsivePopoverContext();
  const ResponsiveFooter = isDesktop ? (_: unknown) => null : DrawerFooter;

  return (
    <ResponsiveFooter className={className} {...props}>
      {children}
    </ResponsiveFooter>
  );
};

export {
  ResponsivePopover,
  ResponsivePopoverTrigger,
  ResponsivePopoverClose,
  ResponsivePopoverContent,
  ResponsivePopoverDescription,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
  ResponsivePopoverBody,
  ResponsivePopoverFooter,
};
