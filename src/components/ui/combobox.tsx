"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./drawer";
import { useMediaQuery } from "../util/hooks";

export function Combobox({
  placeholders,
  emptyRender,
  groups,
  className,
  onSelect,
  defaultValue,
  value,
  setValue,
  afterRender,
}: {
  placeholders?: {
    emptyValue?: string;
    search?: string;
  };
  emptyRender?: React.ReactNode;
  className?: string;
  onSelect?: (value: string) => void;
  defaultValue?: string;
  value?: string;
  setValue?: (value: string) => void;
  afterRender?: React.ReactNode;
  groups: {
    id: string;
    header: React.ReactNode;
    values: {
      id: string;
      render: React.ReactNode;
      selectionRender?: React.ReactNode;
    }[];
  }[];
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(
    defaultValue ?? value ?? undefined
  );

  React.useEffect(() => {
    if (value != undefined && value != localValue) {
      setLocalValue(value);
    }
    if (setValue && localValue != undefined && localValue != value) {
      setValue(localValue ?? "");
    }
  }, [value, localValue, setValue]);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-20 justify-between overflow-hidden", className)}
          >
            {localValue
              ? groups
                  .flatMap((group) => group.values)
                  .find((v) => v.id === localValue)?.selectionRender ??
                groups
                  .flatMap((group) => group.values)
                  .find((v) => v.id === localValue)?.render
              : placeholders?.emptyValue ?? "Select..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">Command Menu</DrawerTitle>
          <Command>
            <CommandInput placeholder={placeholders?.search ?? "Search..."} />
            <CommandList>
              <CommandEmpty>
                {emptyRender ?? <>No results found.</>}
              </CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.id} heading={group.header}>
                  {group.values.map((option) => (
                    <CommandItem
                      key={option.id}
                      onSelect={() => {
                        setLocalValue(option.id);
                        setOpen(false);
                        onSelect?.(option.id);
                      }}
                      className={cn(
                        "flex w-full justify-between px-4 py-2",
                        option.id == localValue &&
                          "text-primary-background bg-primary-foreground"
                      )}
                    >
                      {option.render}
                      {option.id == localValue && <Check className="h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              {afterRender}
            </CommandList>
          </Command>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-20 justify-between overflow-hidden", className)}
        >
          {localValue
            ? groups
                .flatMap((group) => group.values)
                .find((v) => v.id === localValue)?.selectionRender ??
              groups
                .flatMap((group) => group.values)
                .find((v) => v.id === localValue)?.render
            : placeholders?.emptyValue ?? "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(var(--radix-popover-content-available-width),var(--radix-popover-trigger-width))] p-0">
        <Command>
          <CommandInput placeholder={placeholders?.search ?? "Search..."} />
          <CommandList>
            <CommandEmpty>{emptyRender ?? <>No results found.</>}</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.id} heading={group.header}>
                {group.values.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      setLocalValue(option.id);
                      setOpen(false);
                      onSelect?.(option.id);
                    }}
                    className={cn(
                      "flex w-full justify-between px-4 py-2",
                      option.id == localValue &&
                        "text-primary-background bg-primary-foreground"
                    )}
                  >
                    {option.render}
                    {option.id == localValue && <Check className="h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            {afterRender}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
