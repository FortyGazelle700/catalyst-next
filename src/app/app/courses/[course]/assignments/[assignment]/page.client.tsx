/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { CoursesContext, TimeContext } from "@/app/app/layout.providers";
import { FilePreview } from "@/components/catalyst/attachment";
import { Dropzone } from "@/components/catalyst/dropzone";
import { formatDuration } from "@/components/catalyst/format-duration";
import {
  PrettyState,
  SubmissionTypeWithIcon,
} from "@/components/catalyst/pretty-state";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/catalyst/responsible-modal";
import { SubjectIcon } from "@/components/catalyst/subjects";
import { TextEditor } from "@/components/editor/editor.dynamic";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  Sidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { cn } from "@/lib/utils";
import type { Assignment, Submission } from "@/server/api/canvas/types";
import { Temporal } from "@js-temporal/polyfill";
import {
  Notebook,
  Info,
  Calendar,
  Timer,
  Lock,
  Upload,
  File,
  Tally5,
  Percent,
  Minus,
  ArrowUp,
  ArrowUpLeft,
  ArrowLeft,
  ArrowDownLeft,
  ArrowDown,
  CircleSlash2,
  CheckCircle,
  Plus,
  History,
  CircleSlash,
  MoreHorizontal,
  Paperclip,
  ArrowRight,
  Trash,
  X,
  Slash,
  Loader,
  FileText,
  ExternalLink,
  AlertCircle,
  Link2,
  Pencil,
  CheckCircle2,
  Clock4,
  UndoDot,
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import { upload } from "@vercel/blob/client";
import { useTailwindContainerBreakpoints } from "@/components/util/hooks";
import { Input } from "@/components/ui/input";
import { WheelPicker, WheelPickerWrapper } from "@/components/ui/wheel-picker";
import { DateTimePicker } from "@/components/catalyst/date-time-picker";
import BoxWhiskerChart from "@/components/catalyst/box-whiskers-plot";

export function AssignmentSidebar({ assignment }: { assignment: Assignment }) {
  const now = useContext(TimeContext);

  const firstRender = useRef(true);

  const [durationHours, setDurationHours] = useState(
    Math.floor((assignment.data.duration ?? 0) / 60),
  );
  const [durationMinutes, setDurationMinutes] = useState(
    (assignment.data.duration ?? 0) % 60,
  );

  const [hasSetDueDate, setHasSetDueDate] = useState(false);
  const [customDueDate, setCustomDueDate] = useState<Date | null>(null);

  const [customStatus, setCustomStatus] = useState<string | null>(
    assignment.data.status ?? "none",
  );

  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Determine the actual due date to send
    const dueDate = hasSetDueDate ? customDueDate : null;

    const triggerSubmit = setTimeout(() => {
      (async () => {
        await fetch(
          `/api/courses/${assignment.course_id}/assignments/${assignment.id}/overrides/set`,
          {
            method: "POST",
            body: JSON.stringify({
              dueDate: dueDate,
              duration: durationHours * 60 + durationMinutes,
              customStatus,
            }),
          },
        );
      })().catch(console.error);
    }, 2 * 1000);

    return () => clearTimeout(triggerSubmit);
  }, [
    customDueDate,
    durationHours,
    durationMinutes,
    customStatus,
    assignment,
    hasSetDueDate,
  ]);

  const durationSelector = useMemo(() => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="size-6">
            <Pencil className="size-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-1">
          <div className="h4">Custom Duration</div>
          <div className="text-muted-foreground text-xs">
            Used to allocate your time
          </div>
          <div className="flex flex-col gap-2">
            <WheelPickerWrapper>
              <WheelPicker
                value={String(durationHours)}
                onValueChange={(val) => setDurationHours(Number(val))}
                options={Array.from({ length: 25 }).map((_, i) => ({
                  value: String(i),
                  label: i,
                }))}
              />
              <WheelPicker
                value={String(durationMinutes)}
                onValueChange={(val) => setDurationMinutes(Number(val))}
                options={Array.from({ length: 60 / 5 }).map((_, i) => ({
                  value: String(i * 5),
                  label: i * 5,
                }))}
              />
            </WheelPickerWrapper>
          </div>
        </PopoverContent>
      </Popover>
    );
  }, [durationHours, durationMinutes]);

  useEffect(() => {
    if (!hasSetDueDate) {
      setCustomDueDate(null);
    }
  }, [hasSetDueDate]);

  function properCase(str: string | undefined): React.ReactNode {
    if (!str) return "None";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  return (
    <>
      <Sidebar
        collapsible="none"
        className="scrollbar-auto m-2 min-h-max w-[calc(100%-1rem)] overflow-auto rounded-xs @4xl:h-[calc(100%-var(--spacing)*4)] @4xl:w-[20rem]"
      >
        <SidebarHeader className="p-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Notebook className="shrink-0" /> {assignment.name}
          </h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-1 font-bold">
              <Info /> Assignment Info
            </SidebarGroupLabel>
            <div className="flex flex-col gap-2 px-4 py-1">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[12ch] items-center gap-1 text-xs">
                  <Calendar className="size-4" /> Due Date
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {(customDueDate ?? assignment.due_at)
                    ? new Date(
                        customDueDate ?? assignment.due_at ?? "",
                      ).toLocaleString()
                    : "No Due Date"}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="size-6">
                      <Pencil className="size-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-[40ch] flex-col gap-2">
                    <div className="h4">Custom Due Date</div>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      Original Due Date:{" "}
                      {assignment.due_at
                        ? new Date(assignment.due_at).toLocaleString()
                        : "No Due Date"}
                    </div>
                    <div className="flex w-[35ch] items-center gap-2">
                      <DateTimePicker
                        key={hasSetDueDate ? "custom" : "original"} // Force re-render on reset
                        className="flex-1"
                        displayDefault={hasSetDueDate}
                        defaultDate={
                          hasSetDueDate && customDueDate
                            ? customDueDate.toISOString()
                            : assignment.due_at
                              ? new Date(assignment.due_at).toISOString()
                              : new Date(
                                  now.getFullYear(),
                                  now.getMonth(),
                                  now.getDate() + 2,
                                  23,
                                  59,
                                  59,
                                ).toISOString()
                        }
                        setDate={(date) => {
                          if (date == null) {
                            setHasSetDueDate(false);
                            setCustomDueDate(null);
                            return;
                          }

                          // Check if the selected date matches the original due date
                          const originalDueDate = assignment.due_at
                            ? new Date(assignment.due_at)
                            : null;
                          const isSameAsOriginal =
                            originalDueDate &&
                            Math.abs(
                              date.getTime() - originalDueDate.getTime(),
                            ) < 60000; // within 1 minute

                          if (isSameAsOriginal) {
                            setHasSetDueDate(false);
                            setCustomDueDate(null);
                          } else {
                            setHasSetDueDate(true);
                            setCustomDueDate(date);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        disabled={!hasSetDueDate}
                        onClick={() => {
                          setHasSetDueDate(false);
                          setCustomDueDate(null);
                        }}
                      >
                        <UndoDot className="size-4" />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[12ch] items-center gap-1 text-xs">
                  <Timer className="size-4" /> Due{" "}
                  {assignment.due_at
                    ? new Date(assignment.due_at).getTime() >= now.getTime()
                      ? "In"
                      : ""
                    : "In"}
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.due_at ? (
                    <>
                      {formatDuration(
                        Temporal.Instant.from(now.toISOString())
                          .until(new Date(assignment.due_at).toISOString())
                          .abs(),
                        {
                          style: "long",
                          hideUnnecessaryUnits: false,
                          minUnit: "second",
                          maxUnit: "day",
                          maxUnits: 2,
                        },
                      )}
                      {assignment.due_at
                        ? new Date(assignment.due_at).getTime() >= now.getTime()
                          ? ""
                          : " ago"
                        : ""}
                    </>
                  ) : (
                    <Minus className="size-3" />
                  )}
                </span>
              </div>
              <div className="bg-secondary mx-2 h-0.5 rounded-full" />
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[12ch] items-center gap-1 text-xs">
                  <Lock className="size-4" /> Locks
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.lock_at ? (
                    new Date(assignment.lock_at).toLocaleString()
                  ) : (
                    <Minus className="size-3" />
                  )}
                </span>
              </div>
              <div className="bg-secondary mx-2 h-0.5 rounded-full" />
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[12ch] items-center gap-1 text-xs">
                  <Clock4 className="size-4" /> Duration
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {formatDuration(
                    Temporal.Duration.from({
                      minutes: durationMinutes + durationHours * 60,
                    }),
                    {
                      style: "long",
                      hideUnnecessaryUnits: false,
                      minUnit: "minute",
                      maxUnit: "hour",
                      maxUnits: 2,
                    },
                  )}
                </span>
                {durationSelector}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[12ch] items-center gap-1 text-xs">
                  <CheckCircle2 className="size-4" /> Your Status
                </span>
                <Select
                  value={customStatus ?? "none"}
                  onValueChange={setCustomStatus}
                  open={statusOpen}
                  onOpenChange={setStatusOpen}
                >
                  <SelectTrigger
                    size="sm"
                    className="bg-background ml-auto !h-6 py-0 text-xs"
                  >
                    {properCase(customStatus?.replaceAll("_", " "))}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="stuck">Stuck</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-secondary mx-2 h-0.5 rounded-full" />
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[12ch] items-center gap-1 text-xs">
                  <CheckCircle className="size-4" /> Status
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  <PrettyState
                    className="size-3"
                    state={
                      assignment.submission?.workflow_state ?? "unsubmitted"
                    }
                  />
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[12ch] items-center gap-1 text-xs">
                  <Percent className="size-4" /> Points
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.submission?.score != undefined ? (
                    Number(Number(assignment.submission?.score)?.toFixed(2))
                  ) : (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[12ch] items-center gap-1 text-xs">
                  <Tally5 className="size-4" /> Total Points
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.points_possible} pts
                </span>
              </div>
            </div>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-1 font-bold">
              <Upload /> Submission Info
            </SidebarGroupLabel>
            <div className="flex flex-col gap-2 px-4 py-1">
              {assignment.submission_types?.map((type) => (
                <div
                  key={type}
                  className="text-muted-foreground flex flex-col items-start gap-2 text-xs"
                >
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <SubmissionTypeWithIcon
                      className="size-4"
                      submission={type}
                    />
                  </span>
                  {type == "online_upload" && (
                    <div className="flex flex-col gap-2 px-4 py-1">
                      {assignment.allowed_extensions?.map((ext) => (
                        <div
                          key={ext}
                          className="text-muted-foreground flex items-center gap-2 text-xs"
                        >
                          <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <File className="size-4" />
                            *.{ext}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-1 font-bold">
              <Percent /> Scoring Stats
            </SidebarGroupLabel>
            {assignment.score_statistics ? (
              <div className="mx-auto px-4 py-2">
                <BoxWhiskerChart
                  className="pointer-events-none h-12 w-full"
                  width={256}
                  height={64}
                  stats={{
                    min: assignment.score_statistics.min,
                    q1: assignment.score_statistics.lower_q,
                    median: assignment.score_statistics.median,
                    q3: assignment.score_statistics.upper_q,
                    max: assignment.score_statistics.max,
                  }}
                />
              </div>
            ) : (
              <div className="text-muted-foreground/50 mx-auto flex h-16 w-64 items-center justify-center px-4 py-2 text-center text-xs">
                No scoring statistics available.
              </div>
            )}
            <div className="flex flex-col gap-2 px-4 py-1">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[20ch] items-center gap-1 text-xs">
                  <ArrowUp className="size-4" /> High
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.score_statistics?.max ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[20ch] items-center gap-1 text-xs">
                  <ArrowUpLeft className="size-4" /> Upper Quartile
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.score_statistics?.upper_q ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[20ch] items-center gap-1 text-xs">
                  <CircleSlash2 className="size-4" /> Median
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.score_statistics?.median ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[20ch] items-center gap-1 text-xs">
                  <ArrowLeft className="size-4" /> Average
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.score_statistics?.mean ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[20ch] items-center gap-1 text-xs">
                  <ArrowDownLeft className="size-4" /> Lower Quartile
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.score_statistics?.lower_q ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-[20ch] items-center gap-1 text-xs">
                  <ArrowDown className="size-4" /> Low
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {assignment.score_statistics?.min ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
            </div>
          </SidebarGroup>
          <SubmissionArea assignment={assignment} />
        </SidebarContent>
      </Sidebar>
    </>
  );
}

const SubmissionElements = {
  online_upload: ({
    files,
    setFiles,
  }: {
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
  }) => {
    const fileUploadRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      fileUploadRef.current?.addEventListener("change", (evt) => {
        const newFiles = Array.from(
          (evt.target as HTMLInputElement).files ?? [],
        );
        if (files) {
          setFiles((files) => [...files, ...newFiles]);
          fileUploadRef.current!.value = "";
        }
      });
    }, [fileUploadRef, files, setFiles]);

    return (
      <div>
        {files && (
          <div className="flex flex-col gap-2 px-4 pt-1 pb-2">
            <h3 className="text-xs font-bold">Files:</h3>
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="text-muted-foreground flex items-center gap-2 text-xs"
              >
                <span className="text-muted-foreground flex flex-1 items-center gap-1 overflow-hidden text-xs">
                  <File className="size-4" />
                  <span className="flex-1 truncate">{file.name}</span>
                </span>
                <span className="flex items-center justify-end gap-1">
                  {prettyBytes(file.size)}
                </span>
                <Button
                  variant="destructive"
                  className="size-6 text-xs"
                  onClick={() => {
                    setFiles(files.filter((_, i) => i !== idx));
                  }}
                >
                  <Trash className="size-3" />
                </Button>
              </div>
            ))}
            {files.length == 0 && (
              <div className="text-muted-foreground flex items-center gap-2 py-1 text-xs">
                {" "}
                No files uploaded{" "}
              </div>
            )}
          </div>
        )}
        <label className="grid cursor-pointer place-items-center gap-1 rounded-sm border px-8 py-12">
          <input type="file" className="hidden" ref={fileUploadRef} multiple />
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Upload className="size-3" /> Upload a file
          </span>
          <div className="text-muted-foreground flex items-center gap-1 text-[0.6rem]">
            Maximum of 512 MB files
          </div>
        </label>
      </div>
    );
  },
  text_entry: ({
    saveId,
    text,
    setText,
    forceMini = false,
  }: {
    saveId: string;
    text: string;
    setText: Dispatch<string>;
    forceMini?: boolean;
  }) => {
    const [open, setOpen] = useState(false);

    const textEditor = useMemo(
      () => (
        <TextEditor
          content={text}
          setContent={setText}
          saveId={saveId}
          className="min-h-[10rem]"
        />
      ),
      [saveId, text, setText],
    );

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      containerRef.current = document.querySelector(
        "[data-container='assignment']",
      )!;
    }, []);

    const isMobile = useTailwindContainerBreakpoints({
      breakpoint: "4xl",
      reverse: true,
      ref: containerRef,
    });

    return isMobile || forceMini ? (
      <div className="bg-background overflow-hidden rounded-md p-1">
        {textEditor}
      </div>
    ) : (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="grid cursor-pointer place-items-center gap-1 rounded-sm border px-8 py-12">
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <ArrowLeft
                className={cn(
                  "size-3 rotate-0 transition-all",
                  open && "rotate-180",
                )}
              />{" "}
              {open ? "Close" : "Open"} Text Box
            </span>
            <div className="text-muted-foreground flex items-center gap-1 text-[0.6rem]">
              Opens in mini pop out editor
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          onCloseAutoFocus={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          side="left"
          align="end"
          sideOffset={14}
          className="h-[20rem] w-[60ch] overflow-auto"
        >
          {textEditor}
        </PopoverContent>
      </Popover>
    );
  },
  url: ({ url, setTextUrl }: { url: string; setTextUrl: Dispatch<string> }) => {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="url"
          value={url}
          onChange={(e) => setTextUrl(e.target.value)}
          placeholder="https://www.google.com/"
        />
        <Button
          variant="outline"
          className="size-8"
          href={url}
          target="_blank"
          onClick={(evt) => {
            evt.preventDefault();
            window.open(url, "_blank", "width=600,height=400");
          }}
        >
          <ExternalLink className="size-4" />
        </Button>
      </div>
    );
  },
};

export function SubmissionArea({
  assignment,
  forceMini = false,
}: {
  assignment: Assignment;
  forceMini?: boolean;
}) {
  const [submissionType, setSubmissionType] = useState<string>(
    assignment.submission_types?.[0] ?? "none",
  );

  const [files, setFiles] = useState<File[]>([]);

  const [text, setText] = useState("");
  const [url, setTextUrl] = useState("");

  return (
    <>
      <div className="flex-1" />
      <SidebarGroup className="bg-sidebar sticky bottom-0 flex flex-col gap-2">
        <div className="bg-secondary mx-4 h-0.5 rounded-full" />
        <div className="text-destructive-foreground bg-destructive/30 my-2 flex items-center gap-2 rounded-sm px-3 py-2 text-xs">
          <AlertCircle className="size-4 shrink-0" /> Ensure that your
          submission submits.
        </div>
        <div className="bg-secondary mx-4 h-0.5 rounded-full" />
        <h2 className="mt-2 flex items-center gap-1 px-2 text-xs font-bold">
          <History className="size-4" /> Previous Submission
        </h2>
        {assignment.submission ? (
          <>
            {assignment.submission?.attachments?.map((attachment) => (
              <div
                key={attachment.display_name}
                className="text-muted-foreground flex items-center gap-2 px-4 pt-2 text-xs"
              >
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <File className="size-4" />
                  {attachment.display_name}
                </span>
                <span className="flex flex-1 items-center justify-end gap-1">
                  {attachment["content-type"]}
                </span>
              </div>
            ))}
            <Button variant="ghost" className="h-8 justify-start text-xs">
              <MoreHorizontal className="size-3" /> View all submissions
            </Button>
          </>
        ) : (
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <CircleSlash className="size-4" />
              No Previous Submission
            </span>
          </div>
        )}
        <div className="bg-secondary mx-4 h-0.5 rounded-full" />
        <h2 className="mt-2 flex items-center gap-1 px-2 text-xs font-bold">
          <Plus className="size-4" /> New Submission
        </h2>
        {submissionType == "on_paper" ? (
          assignment.submission_types.length == 1 && (
            <div className="grid place-items-center gap-1 rounded-sm border px-8 py-6">
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Paperclip className="size-3" /> On paper submission
              </span>
              <div className="text-muted-foreground flex items-center gap-1 text-[0.6rem]">
                No submissions can be made online
              </div>
            </div>
          )
        ) : (
          <>
            <Select value={submissionType} onValueChange={setSubmissionType}>
              <SelectTrigger className="w-full">
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <SubmissionTypeWithIcon
                    className="size-3"
                    submission={submissionType}
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                {assignment.submission_types?.map((type) => (
                  <SelectItem value={type} key={type}>
                    <SubmissionTypeWithIcon
                      className="size-3"
                      submission={type}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {assignment.submission_types.some(
              (type) => type == "online_upload",
            ) && (
              <Dropzone
                onUpload={(val) => {
                  setFiles([...files, ...val]);
                  setSubmissionType("online_upload");
                }}
              />
            )}
            {(() => {
              switch (submissionType) {
                case "online_upload":
                  return (
                    <>
                      <SubmissionElements.online_upload
                        files={files}
                        setFiles={setFiles}
                      />
                      <FileUploadSubmitButton
                        assignment={assignment}
                        files={files}
                        setFiles={setFiles}
                      />
                    </>
                  );
                case "online_text_entry":
                  return (
                    <>
                      <SubmissionElements.text_entry
                        saveId={`${assignment.id}-text`}
                        text={text}
                        setText={setText}
                        forceMini={forceMini}
                      />
                      <TextSubmitButton text={text} assignment={assignment} />
                    </>
                  );
                case "online_url":
                  return (
                    <>
                      <SubmissionElements.url
                        url={url}
                        setTextUrl={setTextUrl}
                      />
                      <URLSubmitButton url={url} assignment={assignment} />
                    </>
                  );
                case "external_tool":
                  return (
                    <>
                      <Button
                        href={assignment.external_tool_tag_attributes?.url}
                        target="_blank"
                      >
                        <ExternalLink /> Open External URL
                      </Button>
                    </>
                  );
                default:
                  return (
                    <div className="text-muted-foreground flex w-full items-center justify-center gap-2 px-4 py-12 text-xs">
                      Submission Type not supported
                    </div>
                  );
              }
            })()}
          </>
        )}
      </SidebarGroup>
    </>
  );
}

function TextSubmitButton({
  assignment,
  text,
}: {
  assignment: Assignment;
  text: string;
}) {
  const courses = useContext(CoursesContext);
  const [open, setOpen] = useState(false);
  const [finalOpen, setFinalOpen] = useState(false);
  const [submissionState, setSubmissionState] = useState<
    "not_yet" | "pending" | "error" | "success"
  >("not_yet");

  const submit = useCallback(async () => {
    setFinalOpen(false);
    setSubmissionState("pending");
    const request = await fetch(
      `/api/courses/${assignment.course_id}/assignments/${assignment.id}/submissions/submit/text`,
      {
        method: "POST",
        body: JSON.stringify({
          body: text,
        }),
      },
    );
    if (!request.ok) {
      setSubmissionState("error");
      return;
    }
    const { success } = (await request.json()) as {
      success: boolean;
      data: Submission;
      errors?: string[];
    };
    if (success) {
      setSubmissionState("success");
    } else {
      setSubmissionState("error");
    }
  }, [text, assignment]);

  const finalSubmission = useMemo(() => {
    const course = courses.find((course) => course.id == assignment.course_id);
    return (
      <ResponsiveModal
        open={finalOpen}
        onOpenChange={(finalOpen) => setFinalOpen(finalOpen)}
      >
        <ResponsiveModalContent>
          <VisuallyHidden>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>
                {assignment.name} Submission
              </ResponsiveModalTitle>
              <ResponsiveModalDescription>
                {assignment.description}
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>
          </VisuallyHidden>
          <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex items-center justify-start gap-2 border-b p-6 backdrop-blur">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(true);
                setFinalOpen(false);
              }}
            >
              <ArrowLeft /> View Text Entry
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="" className="flex items-center gap-1">
                    {assignment.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Submission</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={async () => {
                  await submit();
                }}
              >
                Submit <ArrowRight />
              </Button>
            </div>
          </div>
          <div className="-m-6 flex max-h-[calc(100vh-24rem)] w-full flex-col items-center justify-center gap-8 overflow-auto px-2 py-16 lg:flex-row">
            <div className="flex flex-col items-center gap-2">
              <div className="flex w-96 flex-row items-center gap-2 rounded-full border px-4 py-2">
                <span className="flex items-center gap-2">
                  <FileText className="size-4" />
                  Text Entry
                </span>
                <span className="text-muted-foreground flex flex-1 items-center justify-end text-xs">
                  {text.split(" ").length} words
                </span>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground shrink-0 rotate-90 lg:rotate-0" />
            <div className="flex w-96 flex-col items-start gap-2 rounded-xl border p-4">
              <span className="flex items-center gap-1 pt-8">
                <Notebook className="size-4" />
                {assignment.name}
              </span>
              <span className="text-muted-foreground flex max-w-full items-center gap-1 overflow-hidden text-xs">
                <SubjectIcon
                  subject={course?.classification ?? ""}
                  className="size-4"
                />
                <span className="max-w-full truncate">
                  {course?.classification} ({course?.original_name})
                </span>
              </span>
              <span className="text-muted-foreground flex max-w-full items-center gap-1 overflow-hidden text-xs">
                <Calendar className="size-4" />
                <span className="max-w-full truncate">
                  {assignment.due_at
                    ? `${new Date(
                        assignment.due_at,
                      ).toLocaleString()} in ${formatDuration(
                        Temporal.Instant.from(new Date().toISOString())
                          .until(new Date(assignment.due_at).toISOString())
                          .abs(),
                        {
                          style: "long",
                          minUnit: "second",
                          maxUnit: "day",
                          maxUnits: 2,
                        },
                      )}`
                    : "No Due Date"}
                </span>
              </span>
            </div>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }, [courses, finalOpen, assignment, submit, text]);

  const handleSubmissionState = useMemo(() => {
    return (
      <ResponsiveModal open={submissionState != "not_yet"}>
        <ResponsiveModalContent>
          <VisuallyHidden>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>
                {assignment.name} Submission State
              </ResponsiveModalTitle>
              <ResponsiveModalDescription>
                {assignment.description}
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>
          </VisuallyHidden>
          <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex items-center justify-start gap-2 border-b p-6 backdrop-blur">
            <Button
              variant="outline"
              disabled={submissionState == "pending"}
              onClick={() => setSubmissionState("not_yet")}
            >
              {submissionState == "pending" ? (
                <>
                  <Loader className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <X /> Close
                </>
              )}
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="" className="flex items-center gap-1">
                    {assignment.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Submission</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              {
                <Button
                  disabled={
                    submissionState == "pending" || submissionState == "not_yet"
                  }
                  onClick={() => {
                    setSubmissionState("not_yet");
                  }}
                >
                  Close <ArrowRight />
                </Button>
              }
            </div>
          </div>
          <div className="-m-6 flex max-h-[calc(100vh-24rem)] w-full flex-col items-center justify-center gap-2 overflow-auto px-2 pt-16 pb-24">
            {(() => {
              switch (submissionState) {
                case "not_yet":
                  return null;
                case "pending":
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <Upload className="size-6" />
                        <span className="text-xl font-bold">Submitting...</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        This may take a second, please be patient.
                      </div>
                    </>
                  );
                case "error":
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <CircleSlash className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Failed
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        There was an error submitting your assignment. Please
                        try again.
                      </div>
                    </>
                  );
                case "success":
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Successful
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        Your assignment has been submitted successfully.
                      </div>
                    </>
                  );
              }
            })()}
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }, [assignment, submissionState]);

  const textPreviews = useMemo(
    () => (
      <>
        {finalSubmission}
        {handleSubmissionState}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <ResponsiveModal
                open={open}
                onOpenChange={(open) => setOpen(open)}
              >
                <ResponsiveModalTrigger asChild>
                  <Button
                    className="w-full justify-between"
                    disabled={text.trim() == ""}
                  >
                    Review Submission <ArrowRight />
                  </Button>
                </ResponsiveModalTrigger>
                <ResponsiveModalContent>
                  <VisuallyHidden>
                    <ResponsiveModalHeader>
                      <ResponsiveModalTitle>
                        {assignment.name} Submission
                      </ResponsiveModalTitle>
                      <ResponsiveModalDescription>
                        {assignment.description}
                      </ResponsiveModalDescription>
                    </ResponsiveModalHeader>
                  </VisuallyHidden>
                  <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex items-center justify-start gap-2 border-b p-6 backdrop-blur">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      <X /> Close
                    </Button>
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="">
                            {assignment.name}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="">Submission</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Text Entry</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setFinalOpen(true);
                          setOpen(false);
                        }}
                      >
                        Continue <ArrowRight />
                      </Button>
                    </div>
                  </div>
                  <div className="-m-6 max-h-[calc(100vh-24rem)] overflow-auto">
                    <TextEditor content={text} readOnly />
                  </div>
                </ResponsiveModalContent>
              </ResponsiveModal>
            </div>
          </TooltipTrigger>
          {text.trim() == "" && (
            <TooltipContent>You must enter some text to submit</TooltipContent>
          )}
        </Tooltip>
      </>
    ),
    [finalSubmission, handleSubmissionState, open, text, assignment],
  );

  return textPreviews;
}

function URLSubmitButton({
  assignment,
  url,
}: {
  assignment: Assignment;
  url: string;
}) {
  const courses = useContext(CoursesContext);
  const [open, setOpen] = useState(false);
  const [submissionState, setSubmissionState] = useState<
    "not_yet" | "pending" | "error" | "success"
  >("not_yet");

  const submit = useCallback(async () => {
    setOpen(false);
    setSubmissionState("pending");
    const request = await fetch(
      `/api/courses/${assignment.course_id}/assignments/${assignment.id}/submissions/submit/url`,
      {
        method: "POST",
        body: JSON.stringify({
          body: url,
        }),
      },
    );
    if (!request.ok) {
      setSubmissionState("error");
      return;
    }
    const { success } = (await request.json()) as {
      success: boolean;
      data: Submission;
      errors?: string[];
    };
    if (success) {
      setSubmissionState("success");
    } else {
      setSubmissionState("error");
    }
  }, [url, assignment]);

  const course = courses.find((course) => course.id == assignment.course_id);

  const handleSubmissionState = useMemo(() => {
    return (
      <ResponsiveModal open={submissionState != "not_yet"}>
        <ResponsiveModalContent>
          <VisuallyHidden>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>
                {assignment.name} Submission State
              </ResponsiveModalTitle>
              <ResponsiveModalDescription>
                {assignment.description}
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>
          </VisuallyHidden>
          <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex items-center justify-start gap-2 border-b p-6 backdrop-blur">
            <Button
              variant="outline"
              disabled={submissionState == "pending"}
              onClick={() => setSubmissionState("not_yet")}
            >
              {submissionState == "pending" ? (
                <>
                  <Loader className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <X /> Close
                </>
              )}
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="" className="flex items-center gap-1">
                    {assignment.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Submission</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              {
                <Button
                  disabled={
                    submissionState == "pending" || submissionState == "not_yet"
                  }
                  onClick={() => {
                    setSubmissionState("not_yet");
                  }}
                >
                  Close <ArrowRight />
                </Button>
              }
            </div>
          </div>
          <div className="-m-6 flex max-h-[calc(100vh-24rem)] w-full flex-col items-center justify-center gap-2 overflow-auto px-2 pt-16 pb-24">
            {(() => {
              switch (submissionState) {
                case "not_yet":
                  return null;
                case "pending":
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <Upload className="size-6" />
                        <span className="text-xl font-bold">Submitting...</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        This may take a second, please be patient.
                      </div>
                    </>
                  );
                case "error":
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <CircleSlash className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Failed
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        There was an error submitting your assignment. Please
                        try again.
                      </div>
                    </>
                  );
                case "success":
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Successful
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        Your assignment has been submitted successfully.
                      </div>
                    </>
                  );
              }
            })()}
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }, [assignment, submissionState]);

  const textPreviews = useMemo(
    () => (
      <>
        {handleSubmissionState}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <ResponsiveModal
                open={open}
                onOpenChange={(open) => setOpen(open)}
              >
                <ResponsiveModalTrigger asChild>
                  <Button
                    className="w-full justify-between"
                    disabled={url.trim() == ""}
                  >
                    Review Submission <ArrowRight />
                  </Button>
                </ResponsiveModalTrigger>
                <ResponsiveModalContent>
                  <VisuallyHidden>
                    <ResponsiveModalHeader>
                      <ResponsiveModalTitle>
                        {assignment.name} Submission
                      </ResponsiveModalTitle>
                      <ResponsiveModalDescription>
                        {assignment.description}
                      </ResponsiveModalDescription>
                    </ResponsiveModalHeader>
                  </VisuallyHidden>
                  <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex items-center justify-start gap-2 border-b p-6 backdrop-blur">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <X /> Close
                    </Button>
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            href=""
                            className="flex items-center gap-1"
                          >
                            {assignment.name}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Submission</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        onClick={async () => {
                          await submit();
                        }}
                      >
                        Submit <ArrowRight />
                      </Button>
                    </div>
                  </div>
                  <div className="-m-6 flex max-h-[calc(100vh-24rem)] w-full flex-col items-center justify-center gap-8 overflow-auto px-2 py-16 lg:flex-row">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex w-96 flex-col items-start gap-1 rounded-full border px-4 py-2">
                        <span className="flex items-center gap-2">
                          <Link2 className="size-4" />
                          URL
                        </span>
                        <span className="text-muted-foreground flex max-w-full flex-1 items-center justify-end text-xs">
                          <span className="truncate pr-4">{url}</span>
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="text-muted-foreground shrink-0 rotate-90 lg:rotate-0" />
                    <div className="flex w-96 flex-col items-start gap-2 rounded-xl border p-4">
                      <span className="flex items-center gap-1 pt-8">
                        <Notebook className="size-4" />
                        {assignment.name}
                      </span>
                      <span className="text-muted-foreground flex max-w-full items-center gap-1 overflow-hidden text-xs">
                        <SubjectIcon
                          subject={course?.classification ?? ""}
                          className="size-4"
                        />
                        <span className="max-w-full truncate">
                          {course?.classification} ({course?.original_name})
                        </span>
                      </span>
                      <span className="text-muted-foreground flex max-w-full items-center gap-1 overflow-hidden text-xs">
                        <Calendar className="size-4" />
                        <span className="max-w-full truncate">
                          {assignment.due_at
                            ? `${new Date(
                                assignment.due_at,
                              ).toLocaleString()} ${new Date(assignment.due_at).getTime() > Date.now() ? "in" : "— Due"} ${formatDuration(
                                Temporal.Instant.from(new Date().toISOString())
                                  .until(
                                    new Date(assignment.due_at).toISOString(),
                                  )
                                  .abs(),
                                {
                                  style: "long",
                                  minUnit: "second",
                                  maxUnit: "day",
                                  maxUnits: 2,
                                },
                              )} ${new Date(assignment.due_at).getTime() < Date.now() ? "ago" : ""}`
                            : "No Due Date"}
                        </span>
                      </span>
                    </div>
                  </div>
                </ResponsiveModalContent>
              </ResponsiveModal>
            </div>
          </TooltipTrigger>
          {url.trim() == "" && (
            <TooltipContent>You must enter a URL to submit</TooltipContent>
          )}
        </Tooltip>
      </>
    ),
    [handleSubmissionState, open, url, assignment, course, submit],
  );

  return textPreviews;
}

function FileUploadSubmitButton({
  assignment,
  files,
  setFiles,
}: {
  assignment: Assignment;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}) {
  const courses = useContext(CoursesContext);
  const [open, setOpen] = useState(false);
  const [finalOpen, setFinalOpen] = useState(false);
  const [submissionState, setSubmissionState] = useState<
    "not_yet" | "pending" | "error" | "success"
  >("not_yet");
  const [fileIdx, setFileIdx] = useState(0);

  const submit = useCallback(async () => {
    setFinalOpen(false);
    setSubmissionState("pending");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file, file.name);
    });
    const request = await fetch(
      `/api/courses/${assignment.course_id}/assignments/${assignment.id}/submissions/submit/files`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!request.ok) {
      setSubmissionState("error");
      return;
    }
    const { success } = (await request.json()) as {
      success: boolean;
      data: Submission;
      errors?: string[];
    };
    if (success) {
      setSubmissionState("success");
    } else {
      setSubmissionState("error");
    }
  }, [assignment.course_id, assignment.id, files]);

  useEffect(() => {
    if (files.length == 0) {
      setOpen(false);
      setFileIdx(0);
    }
  }, [files]);

  const finalSubmission = useMemo(() => {
    const course = courses.find((course) => course.id == assignment.course_id);
    return (
      <ResponsiveModal
        open={finalOpen}
        onOpenChange={(finalOpen) => setFinalOpen(finalOpen)}
      >
        <ResponsiveModalContent>
          <VisuallyHidden>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>
                {assignment.name} Submission
              </ResponsiveModalTitle>
              <ResponsiveModalDescription>
                {assignment.description}
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>
          </VisuallyHidden>
          <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex items-center justify-start gap-2 border-b p-6 backdrop-blur">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(true);
                setFinalOpen(false);
              }}
            >
              <ArrowLeft /> View Files
            </Button>
            <Breadcrumb className="w-full flex-1 overflow-hidden">
              <BreadcrumbList className="flex flex-nowrap items-center gap-2 overflow-x-auto [&_*]:whitespace-nowrap">
                <BreadcrumbItem>
                  <BreadcrumbLink href="" className="flex items-center gap-1">
                    {assignment.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Submission</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={async () => {
                  await submit();
                }}
              >
                Submit <ArrowRight />
              </Button>
            </div>
          </div>
          <div className="-m-6 flex max-h-[calc(100vh-24rem)] w-full flex-col items-center justify-center gap-8 overflow-auto px-2 py-16 lg:flex-row">
            <div className="flex flex-col items-center gap-2">
              {files.map((file) => (
                <div
                  className="flex w-96 flex-row items-center gap-2 rounded-full border px-4 py-2"
                  key={`${file.lastModified}-${file.name}`}
                >
                  <span className="flex items-center gap-2">
                    <File className="size-4" />
                    {file.name}
                  </span>
                  <span className="text-muted-foreground flex flex-1 items-center justify-end text-xs">
                    {prettyBytes(file.size)} - {file.type}
                  </span>
                </div>
              ))}
            </div>
            <ArrowRight className="text-muted-foreground shrink-0 rotate-90 lg:rotate-0" />
            <div className="flex w-96 flex-col items-start gap-2 rounded-xl border p-4">
              <span className="flex items-center gap-1 pt-8">
                <Notebook className="size-4" />
                {assignment.name}
              </span>
              <span className="text-muted-foreground flex max-w-full items-center gap-1 overflow-hidden text-xs">
                <SubjectIcon
                  subject={course?.classification ?? ""}
                  className="size-4"
                />
                <span className="max-w-full truncate">
                  {course?.classification} ({course?.original_name})
                </span>
              </span>
              <span className="text-muted-foreground flex max-w-full items-center gap-1 overflow-hidden text-xs">
                <Calendar className="size-4" />
                <span className="max-w-full truncate">
                  {assignment.due_at
                    ? `${new Date(
                        assignment.due_at,
                      ).toLocaleString()} in ${formatDuration(
                        Temporal.Instant.from(new Date().toISOString())
                          .until(new Date(assignment.due_at).toISOString())
                          .abs(),
                        {
                          style: "long",
                          minUnit: "second",
                          maxUnit: "day",
                          maxUnits: 2,
                        },
                      )}`
                    : "No Due Date"}
                </span>
              </span>
            </div>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }, [courses, finalOpen, assignment, files, submit]);

  const handleSubmissionState = useMemo(() => {
    return (
      <ResponsiveModal open={submissionState != "not_yet"}>
        <ResponsiveModalContent>
          <VisuallyHidden>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>
                {assignment.name} Submission State
              </ResponsiveModalTitle>
              <ResponsiveModalDescription>
                {assignment.description}
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>
          </VisuallyHidden>
          <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex items-center justify-start gap-2 border-b p-6 backdrop-blur">
            <Button
              variant="outline"
              disabled={submissionState == "pending"}
              onClick={() => setSubmissionState("not_yet")}
            >
              {submissionState == "pending" ? (
                <>
                  <Loader className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <X /> Close
                </>
              )}
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="" className="flex items-center gap-1">
                    {assignment.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Submission</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              {
                <Button
                  disabled={
                    submissionState == "pending" || submissionState == "not_yet"
                  }
                  onClick={() => {
                    setSubmissionState("not_yet");
                  }}
                >
                  Close <ArrowRight />
                </Button>
              }
            </div>
          </div>
          <div className="-m-6 flex max-h-[calc(100vh-24rem)] w-full flex-col items-center justify-center gap-2 overflow-auto px-2 pt-16 pb-24">
            {(() => {
              switch (submissionState) {
                case "not_yet":
                  return null;
                case "pending":
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <Upload className="size-6" />
                        <span className="text-xl font-bold">Submitting...</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        This may take a second, please be patient.
                      </div>
                    </>
                  );
                case "error":
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <CircleSlash className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Failed
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        There was an error submitting your assignment. Please
                        try again.
                      </div>
                    </>
                  );
                case "success":
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Successful
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        Your assignment has been submitted successfully.
                      </div>
                    </>
                  );
              }
            })()}
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }, [assignment, submissionState]);

  const filePreviews = useMemo(
    () => (
      <>
        {finalSubmission}
        {handleSubmissionState}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <ResponsiveModal
                open={open}
                onOpenChange={(open) => setOpen(open)}
              >
                <ResponsiveModalTrigger asChild>
                  <Button
                    className="w-full justify-between"
                    disabled={files.length == 0}
                  >
                    Review Submission <ArrowRight />
                  </Button>
                </ResponsiveModalTrigger>
                <ResponsiveModalContent>
                  <VisuallyHidden>
                    <ResponsiveModalHeader>
                      <ResponsiveModalTitle>
                        {assignment.name} Submission
                      </ResponsiveModalTitle>
                      <ResponsiveModalDescription>
                        {assignment.description}
                      </ResponsiveModalDescription>
                    </ResponsiveModalHeader>
                  </VisuallyHidden>
                  <div className="bg-background/50 sticky -top-6 z-10 -mx-6 -mt-6 mb-6 flex w-[calc(100%+theme(spacing.12))] flex-col items-start justify-start gap-2 overflow-hidden border-b p-6 backdrop-blur md:flex-row md:items-center">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      <X /> Close
                    </Button>
                    <Breadcrumb className="w-full flex-1 overflow-hidden">
                      <BreadcrumbList className="flex flex-nowrap items-center gap-2 overflow-x-auto [&_*]:whitespace-nowrap">
                        <BreadcrumbItem>
                          <BreadcrumbLink href="">
                            {assignment.name}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="">Submission</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="">Files</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>
                            {files[fileIdx]?.name}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="flex shrink-0 items-center gap-2 rounded-full border p-1">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setFiles(files.filter((_, i) => i != fileIdx));
                            setFileIdx((i) =>
                              Math.min(Math.max(1, i), files.length - 2),
                            );
                          }}
                          className="shrink-0"
                          disabled={files.length == 0}
                        >
                          <Trash />
                        </Button>
                        <span className="text-muted-foreground flex shrink-0 items-center gap-1 pr-2 pl-4 font-mono text-xs">
                          File Preview {fileIdx + 1}
                          <Slash className="size-2" />
                          {files.length}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setFileIdx((i) => i - 1)}
                          disabled={fileIdx == 0}
                          className="shrink-0"
                        >
                          <ArrowLeft />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setFileIdx((i) => i + 1)}
                          disabled={fileIdx == files.length - 1}
                          className="shrink-0"
                        >
                          <ArrowRight />
                        </Button>
                      </div>
                      <Button
                        onClick={() => {
                          setFinalOpen(true);
                          setOpen(false);
                        }}
                      >
                        Continue <ArrowRight />
                      </Button>
                    </div>
                  </div>
                  <div className="-m-6 max-h-[calc(100vh-24rem)] overflow-auto">
                    {files[fileIdx] && <FilePreview file={files[fileIdx]} />}
                  </div>
                </ResponsiveModalContent>
              </ResponsiveModal>
            </div>
          </TooltipTrigger>
          {files.length == 0 && (
            <TooltipContent>
              Must have at least one file uploaded
            </TooltipContent>
          )}
        </Tooltip>
      </>
    ),
    [
      finalSubmission,
      handleSubmissionState,
      open,
      files,
      assignment,
      fileIdx,
      setFiles,
    ],
  );

  return filePreviews;
}
