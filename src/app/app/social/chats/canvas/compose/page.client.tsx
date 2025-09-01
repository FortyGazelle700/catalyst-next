"use client";

import { Badge } from "@/components/ui/badge";
import { ComposeNew } from "../page.client";
import { UserAvatar } from "@/components/catalyst/user-avatar";
import { Input } from "@/components/ui/input";
import { CoursePicker } from "@/components/catalyst/course-picker";
import { useEffect, useRef, useState } from "react";
import type { User } from "@/server/api/canvas/types";
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from "@/components/catalyst/responsible-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComposeClient({
  name,
  avatar,
}: {
  name: string;
  avatar: string;
}) {
  const [subject, setSubject] = useState(
    typeof window !== "undefined"
      ? (localStorage.getItem("compose-subject") ?? "")
      : "",
  );
  const [course, setCourse] = useState(
    typeof window !== "undefined"
      ? Number(localStorage.getItem("compose-course") ?? "0")
      : 0,
  );
  const [people, setPeople] = useState<User[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<User[]>([]);

  const limit = useRef(100);

  useEffect(() => {
    localStorage.setItem("compose-subject", subject);
  }, [subject]);

  useEffect(() => {
    localStorage.setItem("compose-course", String(course));
  }, [course]);

  useEffect(() => {
    (async () => {
      setPeople([]);
      if (!course || Number(course) == 0) return;
      setPeopleLoading(true);
      let stop = false;
      let page = 1;
      while (!stop) {
        const response = await fetch(
          `/api/courses/${course}/people?cursor=${page}&limit=${limit.current}`,
        );
        const data = (await response.json()) as {
          success: true;
          data: User[];
          errors: { message: string }[];
        };
        if (data.data?.length < limit.current) {
          stop = true;
        }
        setPeople((people) => [
          ...people,
          ...data.data.slice(0, limit.current),
        ]);
        page++;
      }
      setPeopleLoading(false);
    })().catch(console.error);
  }, [course]);

  return (
    <div className="@container h-full overflow-auto">
      <div className="hidden flex-col gap-2 @[1rem]:flex">
        <div className="flex w-full flex-col items-center justify-between gap-2 border-y p-4 @2xl:flex-row">
          <h3 className="h4 flex w-full items-center gap-4">
            <UserAvatar name={name} image={avatar} className="size-10" />
            <div className="flex w-full flex-col gap-2 @2xl:pr-16">
              <Input
                placeholder="Subject"
                className="w-full"
                value={subject}
                onChange={(evt) => setSubject(evt.currentTarget.value)}
              />
              <div className="flex flex-col items-center gap-2 @4xl:flex-row">
                <CoursePicker
                  course={course}
                  onSelect={setCourse}
                  className="w-full flex-1 @4xl:w-auto"
                />
                <ResponsivePopover>
                  <ResponsivePopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-input/30 w-full flex-1 justify-between @4xl:w-auto"
                    >
                      {(() => {
                        if (selectedPeople.length == 0) {
                          return <>Select people...</>;
                        } else if (selectedPeople.length == 1) {
                          return <>{selectedPeople[0]!.name}</>;
                        } else if (selectedPeople.length == 2) {
                          return (
                            <>
                              {selectedPeople[0]!.name} and{" "}
                              {selectedPeople[1]!.name}
                            </>
                          );
                        } else if (selectedPeople.length == people.length) {
                          return <>All people selected</>;
                        } else {
                          return <>{selectedPeople.length} people selected</>;
                        }
                      })()}
                      <ChevronDown className="stroke-muted-foreground" />
                    </Button>
                  </ResponsivePopoverTrigger>
                  <ResponsivePopoverContent className="w-[40ch] overflow-hidden">
                    <Command className="relative -m-4 h-[calc(100%-theme(spacing.8))] w-[calc(100%+theme(spacing.8))] rounded-none">
                      <CommandInput placeholder="Search people..." />
                      <CommandList>
                        <CommandEmpty>No people found</CommandEmpty>
                        <CommandGroup heading="Mass Actions">
                          <CommandItem
                            onSelect={() => {
                              setSelectedPeople(people);
                            }}
                          >
                            Select all
                            <Check
                              className={cn(
                                "stroke-foreground ml-auto h-4 w-4",
                                selectedPeople.length != people.length &&
                                  "hidden",
                              )}
                            />
                          </CommandItem>
                          <CommandItem
                            onSelect={() => {
                              setSelectedPeople([]);
                            }}
                          >
                            Deselect all
                            <Check
                              className={cn(
                                "stroke-foreground ml-auto h-4 w-4",
                                selectedPeople.length != 0 && "hidden",
                              )}
                            />
                          </CommandItem>
                        </CommandGroup>
                        <CommandGroup heading="People">
                          {people?.map((person) => (
                            <CommandItem
                              key={person.id}
                              onSelect={() => {
                                if (
                                  selectedPeople.some((p) => p.id === person.id)
                                ) {
                                  setSelectedPeople(
                                    selectedPeople.filter(
                                      (p) => p.id !== person.id,
                                    ),
                                  );
                                } else {
                                  setSelectedPeople([
                                    ...selectedPeople,
                                    person,
                                  ]);
                                }
                              }}
                            >
                              {person.name}{" "}
                              <Check
                                className={cn(
                                  "stroke-foreground ml-auto h-4 w-4",
                                  !selectedPeople.some(
                                    (p) => p.id === person.id,
                                  ) && "hidden",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                      {peopleLoading && (
                        <div className="text-muted-foreground bg-background sticky bottom-0 flex w-full items-center justify-center gap-1 border-t p-4 text-xs">
                          <Loader className="size-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      )}
                    </Command>
                  </ResponsivePopoverContent>
                </ResponsivePopover>
              </div>
            </div>
          </h3>
          <span className="text-muted-foreground flex shrink-0 flex-row items-end gap-4 text-right text-xs @2xl:flex-col @2xl:gap-1">
            <Badge variant="secondary" className="w-max">
              Compose Message
            </Badge>
            <div>{new Date().toLocaleString()}</div>
            <div>Now</div>
          </span>
        </div>
        <div className="p-4">
          <ComposeNew
            subject={subject}
            context={course}
            participants={selectedPeople?.map((p) => p.id)}
          />
        </div>
      </div>
    </div>
  );
}
