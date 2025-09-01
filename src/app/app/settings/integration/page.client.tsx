"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ApiCtx } from "@/server/api";
import { WheelPickerWrapper, WheelPicker } from "@/components/ui/wheel-picker";
import {
  ArrowRight,
  Check,
  ChevronsUpDown,
  Circle,
  ExternalLink,
  Info,
  List,
  ListTree,
  Loader,
  Lock,
  Play,
  Plus,
  RotateCw,
  School,
  Trash,
  User,
  X,
} from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimationPlayer } from "@/components/catalyst/animation-player";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { CoursesContext, CoursesRefreshContext } from "../../layout.providers";
import { cn } from "@/lib/utils";

const options = [
  {
    label: "Kindergarten",
    value: "0",
  },
  ...Array.from({ length: 12 }, (_, i) => i + 1).map((v) => ({
    label: `Grade ${v.toString()}`,
    value: v.toString(),
  })),
  {
    label: "College and Beyond",
    value: "13",
  },
];

export default function IntegrationSettings({
  settings,
  setLink,
  setSettings,
}: {
  link: string;
  setLink: Dispatch<SetStateAction<string>>;
  settings: ApiCtx["user"]["settings"];
  setSettings: Dispatch<SetStateAction<ApiCtx["user"]["settings"]>>;
  isPro: boolean;
}) {
  const [schoolFetching, setSchoolFetching] = useState(true);
  const [periodsFetching, setPeriodsFetching] = useState(true);
  const [schools, setSchools] = useState<
    {
      id: string;
      name: string;
      district: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      canvasURL: string;
      isPublic: boolean;
      isComplete: boolean;
    }[]
  >([]);

  const [tokenState, setTokenState] = useState<"success" | "error" | "pending">(
    "pending",
  );

  useEffect(() => {
    setTokenState("pending");

    if (settings.canvas_token == undefined) {
      refreshCourses(Math.random());
    }

    const request = async () => {
      const req = await fetch("/api/verify-token", {
        method: "POST",
        body: JSON.stringify({ token: settings.canvas_token }),
      });
      if (req.status == 200) {
        setTokenState("success");
      } else {
        setTokenState("error");
      }
    };

    const debouncer = setTimeout(() => {
      request().catch(console.error);
    }, 1000);

    return () => {
      clearTimeout(debouncer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.canvas_token]);

  const [isPlayerCollapsed, setIsPlayerCollapsed] = useState(true);
  const [periods, setPeriods] = useState<
    {
      id: string;
      name: string;
      type: "single" | "course" | "filler";
      periodOrder: number;
      optionOrder: number;
      options:
        | {
            id: string;
            name: string;
            type: "single" | "course" | "filler" | null;
            schoolId: string;
            periodId: string;
            optionId: string;
            periodName: string;
            optionName: string;
            periodOrder: number | null;
            optionOrder: number | null;
          }[]
        | undefined;
      schoolId: string;
      periodId: string;
      optionId: string;
      periodName: string;
      optionName: string;
    }[]
  >([]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [defaultValues, setDefaultValues] = useState<Record<string, string>>(
    {},
  );
  const courses = useContext(CoursesContext);
  const refreshCourses = useContext(CoursesRefreshContext);

  useEffect(() => {
    (async () => {
      setSchoolFetching(true);
      const reqValues = await fetch(
        "/api/catalyst/account/settings/list-periods",
      );
      const { data } = (await reqValues.json()) as {
        success: boolean;
        data: {
          id: string;
          userId: string;
          periodId: string;
          value: string;
        }[];
        errors: { message: string }[];
      };
      const values: Record<string, string> = {};
      for (const item of data) {
        values[item.periodId] = item.value;
      }
      setValues(values);
      setDefaultValues(values);
      const req = await fetch("/api/catalyst/schools/list");
      const { data: schools } = (await req.json()) as {
        success: boolean;
        data: {
          id: string;
          name: string;
          district: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          canvasURL: string;
          isPublic: boolean;
          isComplete: boolean;
        }[];
        errors: { message: string }[];
      };
      setSchools(schools);
      setSchoolFetching(false);
    })().catch(console.error);
  }, []);

  useEffect(() => {
    (async () => {
      setPeriodsFetching(true);
      const req = await fetch(
        `/api/catalyst/schools/periods/list?id=${settings.school_id}`,
      );
      const { data: schools } = (await req.json()) as {
        success: boolean;
        data: {
          id: string;
          name: string;
          type: "single" | "course" | "filler";
          periodOrder: number;
          optionOrder: number;
          options:
            | {
                id: string;
                name: string;
                type: "single" | "course" | "filler" | null;
                schoolId: string;
                periodId: string;
                optionId: string;
                periodName: string;
                optionName: string;
                periodOrder: number | null;
                optionOrder: number | null;
              }[]
            | undefined;
          schoolId: string;
          periodId: string;
          optionId: string;
          periodName: string;
          optionName: string;
        }[];
        errors: { message: string }[];
      };
      setPeriods(schools);
      setPeriodsFetching(false);
    })().catch(console.error);
  }, [settings.school_id]);

  const hasChanged = useRef(false);

  useEffect(() => {
    if (JSON.stringify(values) == JSON.stringify(defaultValues)) {
      setSettings({
        ...settings,
        periods: JSON.stringify(values),
        periodsChanged: undefined as unknown as string,
      });
    } else {
      setSettings({
        ...settings,
        periods: JSON.stringify(values),
        periodsChanged: "true",
      });
    }
    hasChanged.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (hasChanged.current) {
      hasChanged.current = false;
      return;
    }
    setValues(JSON.parse(settings.periods ?? "{}") as Record<string, string>);
  }, [settings.periods]);

  useEffect(() => {
    if (settings.periodsChanged == undefined) {
      setSettings({
        ...settings,
        periods: JSON.stringify(defaultValues),
        periodsChanged: undefined as unknown as string,
      });
      setValues(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.periodsChanged]);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="mt-4 flex items-center gap-2 font-bold">
          <School /> Academic Information
        </h2>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <label className="text-muted-foreground flex flex-col gap-1 text-xs lg:w-[25ch]">
          Grade
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="dark:bg-input/30 flex w-full justify-between"
              >
                <span>
                  {options.find((option) => option.value === settings.grade)
                    ?.label ?? "Select a grade..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <WheelPickerWrapper>
                <WheelPicker
                  options={options}
                  value={settings.grade ?? "0"}
                  onValueChange={(val) =>
                    setSettings({
                      ...settings,
                      ["grade"]: val,
                    })
                  }
                />
              </WheelPickerWrapper>
            </PopoverContent>
          </Popover>
        </label>
        <label className="text-muted-foreground flex flex-1 flex-col gap-1 text-xs">
          School
          {schoolFetching ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Combobox
              emptyRender={
                <div className="pointer-events-none relative -mb-16 flex h-32 w-full flex-col items-center justify-center">
                  <div className="flex-1">
                    <div className="h3">No schools found</div>
                    <div className="text-muted-foreground text-sm">
                      Try adjusting your search or adding a new school.
                    </div>
                  </div>
                </div>
              }
              placeholders={{
                emptyValue: "Select a school...",
                search: "Search for a school...",
              }}
              defaultValue={settings.school_id ?? undefined}
              onSelect={(value) => {
                setSettings({
                  ...settings,
                  ["school_id"]: value,
                });
              }}
              className="w-full"
              groups={[
                {
                  id: "schools",
                  header: "",
                  values: schools.map((school) => ({
                    id: school.id,
                    render: (
                      <div className="flex w-full items-center justify-between">
                        <span>{school.name}</span>
                        <div>
                          {school.isComplete ? (
                            <></>
                          ) : (
                            <Badge variant="destructive">
                              <X />
                              Incomplete
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {school.isPublic ? (
                              <>
                                <User /> Public
                              </>
                            ) : (
                              <>
                                <Lock />
                                Private
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    ),
                  })),
                },
              ]}
              afterRender={
                <div className="flex w-full items-center justify-end p-2">
                  <Button href="/app/onboarding/school">
                    <Plus /> Add School
                  </Button>
                </div>
              }
            />
          )}
        </label>
      </div>
      <div>
        <h2 className="mt-4 flex items-center gap-2 font-bold">
          <Circle /> Canvas Integration
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-muted-foreground flex-1 text-xs">
          Canvas Token
          <Input
            value={settings.canvas_token}
            onChange={(evt) => {
              setSettings({
                ...settings,
                canvas_token: evt.target.value,
              });
            }}
            placeholder="10968~hatU3zFhYaCCYAE2BaANYnBxKHaZrNNFvLCtyyErfXKytzVxuAAeHCc9NtHD2zxe"
            disabled={(settings.tokenIsSaved ?? "true") == "true"}
            readOnly={(settings.tokenIsSaved ?? "true") == "true"}
            className="text-foreground"
          />
          <div className="mt-1 flex flex-col items-center justify-between gap-2 md:flex-row">
            {(settings.tokenIsSaved ?? "true") == "true" ? (
              <div className="flex items-center gap-1 px-2 text-xs text-yellow-600 dark:text-yellow-500">
                <Info className="mt-0.5 size-4 shrink-0" />
                <span>
                  This is not your actual token, your token is saved, but if you
                  need to change it, you can reroll it.
                </span>
              </div>
            ) : (
              <span className="flex items-center gap-1">
                {(() => {
                  switch (tokenState) {
                    case "pending":
                      return (
                        <>
                          <Loader className="size-3 animate-spin" />{" "}
                          Verifying...
                        </>
                      );
                    case "error":
                      return (
                        <>
                          <X className="size-3" /> Failed
                        </>
                      );
                    case "success":
                      return (
                        <>
                          <Check className="size-3" /> Verified
                        </>
                      );
                  }
                })()}
              </span>
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                className="text-xs"
                onClick={() => setIsPlayerCollapsed(!isPlayerCollapsed)}
              >
                <Play className="size-3" /> Review Steps
              </Button>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    tokenIsSaved: "false",
                  });
                }}
                variant="link"
                className="text-xs"
                disabled={!((settings.tokenIsSaved ?? "true") == "true")}
              >
                <RotateCw className="size-3" /> Reroll Token
              </Button>
            </div>
          </div>
        </label>
        <AnimatePresence>
          {!isPlayerCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div>
                <AnimationPlayer
                  src="/canvas.lottie.json"
                  loop
                  className="overflow-hidden rounded-md border"
                />
                <Button
                  href={
                    schools.find((school) => school.id == settings.school_id)
                      ?.canvasURL
                  }
                  target="_blank"
                  variant="secondary"
                  className="absolute top-2 right-2"
                >
                  Open Canvas <ExternalLink />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <List /> Period Settings
        </h2>
      </div>
      <div className="flex flex-col">
        {periodsFetching ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          periods?.map(
            (period, index) =>
              period && (
                <div
                  key={period.id}
                  className={cn(
                    "flex w-full flex-col items-center gap-2 p-4 sm:flex-row",
                    index != 0 && "border-t",
                  )}
                >
                  <h2 className="w-full pl-4 text-left font-bold sm:w-auto sm:pl-0">
                    {period.name}
                  </h2>
                  {(() => {
                    switch (period.type) {
                      case "filler":
                        return (
                          <span className="text-muted-foreground bg-input/30 border-input w-full flex-1 rounded-full border px-4 py-2 text-sm sm:ml-auto sm:max-w-[20rem]">
                            No Selectable Options
                          </span>
                        );
                      case "single":
                        return (
                          <Combobox
                            className="w-full flex-1 sm:ml-auto sm:max-w-[20rem]"
                            onSelect={(valueId) => {
                              setValues((prev) => ({
                                ...prev,
                                [period.id]: valueId,
                              }));
                            }}
                            value={values[period.id]}
                            groups={[
                              {
                                id: period.id,
                                header: "",
                                values: [
                                  { id: "", render: "Empty" },
                                  ...period.options!.map((value) => ({
                                    id: value.id,
                                    render: value.name,
                                  })),
                                ],
                              },
                            ]}
                          />
                        );
                      case "course":
                        return (
                          <Combobox
                            className="w-full flex-1 sm:ml-auto sm:max-w-[20rem]"
                            placeholders={{
                              emptyValue: "Select a course",
                              search: "Search for a course",
                            }}
                            onSelect={(courseId) => {
                              setValues((prev) => ({
                                ...prev,
                                [period.id]: courseId,
                              }));
                            }}
                            value={values[period.id]}
                            groups={[
                              {
                                id: period.id,
                                header: "",
                                values: [
                                  {
                                    id: "",
                                    render: (
                                      <div className="flex flex-col gap-2 overflow-hidden">
                                        <span className="font-bold">Blank</span>
                                        <span className="text-muted-foreground truncate text-xs">
                                          Empty
                                        </span>
                                      </div>
                                    ),
                                    selectionRender: (
                                      <div className="flex flex-col gap-2 truncate">
                                        Filler
                                      </div>
                                    ),
                                  },
                                  ...(courses.map((course) => ({
                                    id: String(course.id),
                                    render: (
                                      <div className="flex flex-col gap-2 overflow-hidden">
                                        <span className="font-bold">
                                          {course.classification ??
                                            "No Classification"}
                                        </span>
                                        <span className="text-muted-foreground truncate text-xs">
                                          {course.original_name}
                                        </span>
                                      </div>
                                    ),
                                    selectionRender: (
                                      <div className="flex flex-col gap-2 truncate">
                                        {course.classification ??
                                          "No Classification"}{" "}
                                        ({course.original_name})
                                      </div>
                                    ),
                                  })) ?? []),
                                ],
                              },
                            ]}
                          />
                        );
                    }
                  })()}
                </div>
              ),
          )
        )}
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <ListTree /> Related Settings
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-2">
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/security")}
        >
          <div className="flex items-center gap-3">
            <Lock className="size-6" />
            <span>Security</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/destructive")}
        >
          <div className="flex items-center gap-3">
            <Trash className="size-6" />
            <span>Delete Account</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
