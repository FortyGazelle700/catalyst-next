"use client";

import {
  CommandInput,
  CommandList,
  CommandDialog,
} from "@/components/ui/command";
import { Slot } from "@radix-ui/react-slot";
import { createContext, useContext, useState, useEffect } from "react";
import { useCommandSearch } from "@/hooks/use-command-search";
import { CommandSearchResults } from "@/components/catalyst/search-results";

export const CommandMenuContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => null,
});

export function CommandMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <CommandMenuContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandMenu open={open} setOpen={setOpen} />
    </CommandMenuContext.Provider>
  );
}

export function OpenCommandMenu({ children }: { children: React.ReactNode }) {
  const { setOpen } = useContext(CommandMenuContext);
  return <Slot onClick={() => setOpen(true)}>{children}</Slot>;
}

export function CommandMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const { loading, error, results, defaultOptions, search } =
    useCommandSearch();

  // Update search when query changes
  useEffect(() => {
    search(query);
  }, [query, search]);

  // Clear query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={
          query.trim()
            ? "Search courses, assignments, grades, and pages..."
            : "Search or navigate to any page..."
        }
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {error ? (
          <div className="flex flex-col items-center justify-center px-4 py-12">
            <div className="text-destructive mb-2 text-sm">
              Error loading data
            </div>
            <div className="text-muted-foreground text-center text-xs">
              {error}
            </div>
          </div>
        ) : (
          <CommandSearchResults
            results={results}
            defaultOptions={defaultOptions}
            loading={loading}
            query={query}
            onSelect={handleClose}
          />
        )}
      </CommandList>
    </CommandDialog>
  );
}
