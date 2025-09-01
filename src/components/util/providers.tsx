"use client";

import { type PropsWithChildren } from "react";

import type * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "../ui/tooltip";
import { PostHogProvider } from "./PostHogProvider";
import { type User } from "next-auth";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export const Providers = ({
  children,
  user,
}: PropsWithChildren & {
  user?: User;
}) => {
  return (
    <>
      <PostHogProvider user={user}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </PostHogProvider>
    </>
  );
};
