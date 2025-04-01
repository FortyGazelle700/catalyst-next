"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";

import Cookies from "universal-cookie";

export function Accordion({
  onValueChange,
  saveId = "accordion",
  values = [],
  value,
  type = "single",
  defaultValue,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & {
  saveId?: string;
  values?: string[];
}) {
  return (
    <>
      {type === "single" ? (
        <AccordionPrimitive.Root
          data-slot="accordion"
          onValueChange={(open: string & string[]) => {
            values.forEach((segment) => {
              new Cookies(null, { path: "/" }).set(
                `accordion-state-${saveId}-${segment}`,
                open === segment
              );
            });
            onValueChange?.(open);
          }}
          type="single"
          value={value as string}
          defaultValue={defaultValue as string}
          {...props}
        />
      ) : (
        <AccordionPrimitive.Root
          data-slot="accordion"
          onValueChange={(open: string & string[]) => {
            values.forEach((segment) => {
              new Cookies(null, { path: "/" }).set(
                `accordion-state-${saveId}-${segment}`,
                open.includes(segment)
              );
            });
            onValueChange?.(open);
          }}
          type="multiple"
          value={value as string[]}
          defaultValue={defaultValue as string[]}
          {...props}
        />
      )}
    </>
  );
}
export const AccordionItem = AccordionPrimitive.Item;
export const AccordionHeader = AccordionPrimitive.Header;
export const AccordionTrigger = AccordionPrimitive.Trigger;
export const AccordionContent = AccordionPrimitive.Content;
