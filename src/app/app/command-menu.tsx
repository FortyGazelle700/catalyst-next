"use client";

import {
  CommandInput,
  CommandList,
  CommandDialog,
} from "@/components/ui/command";
import { Slot } from "@radix-ui/react-slot";
import { Construction } from "lucide-react";
import { createContext, useContext, useState } from "react";

const CommandMenuContext = createContext<{
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
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <div className="flex flex-col px-8 pt-16 pb-4">
          <Construction className="-mb-2 size-12" />
          <h1 className="h3 font-bold">Currently Under Construction</h1>
          <p className="p text-muted-foreground -mt-2 text-xs">
            This command menu is currently under construction. Please check back
            later.
          </p>
        </div>
        {/* <CommandEmpty>No results</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem
            value="search"
            onSelect={() => console.log("Search selected")}
          >
            Search
          </CommandItem>
          <CommandItem value="settings" onSelect={() => null}>
            Settings
          </CommandItem>
        </CommandGroup> */}
      </CommandList>
    </CommandDialog>
  );
}
