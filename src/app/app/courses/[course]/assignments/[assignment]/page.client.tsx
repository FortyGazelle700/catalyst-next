"use client";

import { CoursesContext, TimeContext } from "@/app/app/layout.providers";
import {
  AttachmentPreview,
  FilePreview,
} from "@/components/catalyst/attachment";
import { Dropzone } from "@/components/catalyst/dropzone";
import { formatDuration } from "@/components/catalyst/format-duration";
import {
  PrettyState,
  SubmissionType,
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
import { TextEditor } from "@/components/editor/editor";
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
import type { Assignment } from "@/server/api/canvas/types";
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
  Files,
  Slash,
  Loader,
  FileText,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import {
  Dispatch,
  JSX,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { upload } from "@vercel/blob/client";

export function AssignmentSidebar({ assignment }: { assignment: Assignment }) {
  const now = useContext(TimeContext);

  return (
    <>
      <Sidebar
        collapsible="none"
        className="rounded-xs m-2 min-h-max @4xl:h-[calc(100%-var(--spacing)*4)] overflow-auto scrollbar-auto w-[calc(100%-1rem)] @4xl:w-[20rem]"
      >
        <SidebarHeader>
          <h1 className="font-bold text-2xl flex items-center gap-1">
            <Notebook /> {assignment.name}
          </h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-1 font-bold">
              <Info /> Assignment Info
            </SidebarGroupLabel>
            <div className="flex flex-col gap-2 px-4 py-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[12ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <Calendar className="size-4" /> Due Date
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  {assignment.due_at
                    ? new Date(assignment.due_at).toLocaleString()
                    : "No Due Date"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[12ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <Timer className="size-4" /> Due{" "}
                  {assignment.due_at
                    ? new Date(assignment.due_at).getTime() >= now.getTime()
                      ? "In"
                      : ""
                    : "In"}
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
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
                        }
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
              <div className="mx-2 h-0.5 bg-secondary rounded-full" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[12ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <Lock className="size-4" /> Locks
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  {assignment.lock_at ? (
                    new Date(assignment.lock_at).toLocaleString()
                  ) : (
                    <Minus className="size-3" />
                  )}
                </span>
              </div>
              <div className="mx-2 h-0.5 bg-secondary rounded-full" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[12ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <CheckCircle className="size-4" /> Status
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  <PrettyState
                    className="size-3"
                    state={
                      assignment.submission?.workflow_state ?? "unsubmitted"
                    }
                  />
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[12ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <Percent className="size-4" /> Points
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  {assignment.submission?.score != undefined ? (
                    Number(Number(assignment.submission?.score)?.toFixed(2))
                  ) : (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[12ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <Tally5 className="size-4" /> Total Points
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
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
                  className="flex flex-col items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="text-xs text-muted-foreground flex gap-1 items-center">
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
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="text-xs text-muted-foreground flex gap-1 items-center">
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
            <div className="flex flex-col gap-2 px-4 py-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[20ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <ArrowUp className="size-4" /> High
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  {assignment.score_statistics?.max ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[20ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <ArrowUpLeft className="size-4" /> Upper Quartile
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  {assignment.score_statistics?.upper_q ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[20ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <CircleSlash2 className="size-4" /> Median
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  {assignment.score_statistics?.median ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[20ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <ArrowLeft className="size-4" /> Average
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  {assignment.score_statistics?.mean ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[20ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <ArrowDownLeft className="size-4" /> Lower Quartile
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  {assignment.score_statistics?.lower_q ?? (
                    <Minus className="size-3" />
                  )}{" "}
                  pts
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-[20ch] text-xs text-muted-foreground flex gap-1 items-center">
                  <ArrowDown className="size-4" /> Low
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
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
          (evt.target as HTMLInputElement).files ?? []
        );
        if (files) {
          setFiles((files) => [...files, ...newFiles]);
          fileUploadRef.current!.value = "";
        }
      });
    }, [fileUploadRef]);

    return (
      <div>
        {files && (
          <div className="flex flex-col gap-2 px-4 pt-1 pb-2">
            <h3 className="text-xs font-bold">Files:</h3>
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className="text-xs text-muted-foreground flex gap-1 items-center flex-1 overflow-hidden">
                  <File className="size-4" />
                  <span className="truncate flex-1">{file.name}</span>
                </span>
                <span className="flex items-center gap-1 justify-end">
                  {prettyBytes(file.size)}
                </span>
                <Button
                  variant="destructive"
                  className="text-xs size-6"
                  onClick={() => {
                    setFiles(files.filter((_, i) => i !== idx));
                  }}
                >
                  <Trash className="size-3" />
                </Button>
              </div>
            ))}
            {files.length == 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                {" "}
                No files uploaded{" "}
              </div>
            )}
          </div>
        )}
        <label className="grid place-items-center border gap-1 px-8 py-12 rounded-sm cursor-pointer">
          <input type="file" className="hidden" ref={fileUploadRef} multiple />
          <span className="flex gap-1 items-center text-muted-foreground text-xs">
            <Upload className="size-3" /> Upload a file
          </span>
          <div className="flex items-center gap-1 text-[0.6rem] text-muted-foreground">
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
  }: {
    saveId: string;
    text: string;
    setText: Dispatch<string>;
  }) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="grid place-items-center border gap-1 px-8 py-12 rounded-sm cursor-pointer">
            <span className="flex gap-1 items-center text-muted-foreground text-xs">
              <ArrowLeft
                className={cn("size-3 transition-all", open && "rotate-180")}
              />{" "}
              {open ? "Close" : "Open"} Text Box
            </span>
            <div className="flex items-center gap-1 text-[0.6rem] text-muted-foreground">
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
          className="w-[60ch] h-[20rem] overflow-auto"
        >
          <TextEditor
            content={text}
            setContent={setText}
            saveId={saveId}
            className="min-h-[10rem]"
          />
        </PopoverContent>
      </Popover>
    );
  },
};

export function SubmissionArea({ assignment }: { assignment: Assignment }) {
  const [submissionType, setSubmissionType] = useState<string>(
    assignment.submission_types?.[0] ?? "none"
  );

  const [files, setFiles] = useState<File[]>([]);

  const [text, setText] = useState("");

  return (
    <>
      <div className="flex-1" />
      <SidebarGroup className="sticky bottom-0 flex flex-col gap-2 bg-sidebar">
        <div className="text-destructive-foreground text-xs flex gap-1 items-center px-2">
          <AlertCircle className="size-3 flex-shrink-0" /> Submissions may not
          work as intended. Please verify that your submission submit correctly.
        </div>
        <div className="rounded-full h-0.5 mx-4 bg-secondary" />
        <h2 className="font-bold px-2 flex items-center gap-1 text-xs mt-2">
          <History className="size-4" /> Previous Submission
        </h2>
        {assignment.submission ? (
          <>
            {assignment.submission?.attachments?.map((attachment) => (
              <div
                key={attachment.display_name}
                className="flex items-center gap-2 text-xs text-muted-foreground px-4 pt-2"
              >
                <span className="text-xs text-muted-foreground flex gap-1 items-center">
                  <File className="size-4" />
                  {attachment.display_name}
                </span>
                <span className="flex items-center gap-1 justify-end flex-1">
                  {attachment["content-type"]}
                </span>
              </div>
            ))}
            <Button variant="ghost" className="text-xs h-8 justify-start">
              <MoreHorizontal className="size-3" /> View all submissions
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-xs text-muted-foreground flex gap-1 items-center">
              <CircleSlash className="size-4" />
              No Previous Submission
            </span>
          </div>
        )}
        <div className="rounded-full h-0.5 mx-4 bg-secondary" />
        <h2 className="font-bold px-2 flex items-center gap-1 text-xs mt-2">
          <Plus className="size-4" /> New Submission
        </h2>
        {submissionType == "on_paper" ? (
          assignment.submission_types.length == 1 && (
            <div className="grid place-items-center border gap-1 px-8 py-6 rounded-sm">
              <span className="flex gap-1 items-center text-muted-foreground text-xs">
                <Paperclip className="size-3" /> On paper submission
              </span>
              <div className="flex items-center gap-1 text-[0.6rem] text-muted-foreground">
                No submissions can be made online
              </div>
            </div>
          )
        ) : (
          <>
            <Select value={submissionType} onValueChange={setSubmissionType}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
              (type) => type == "online_upload"
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
                      />
                      <TextSubmitButton text={text} assignment={assignment} />
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
                    <div className="flex items-center justify-center gap-2 py-12 px-4 text-xs text-muted-foreground w-full">
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

  const submit = async () => {
    setFinalOpen(false);
    setSubmissionState("pending");
    const request = await fetch(
      `/api/courses/${assignment.course_id}/assignments/${assignment.id}/submissions/submit/text`,
      {
        method: "POST",
        body: JSON.stringify({
          body: text,
        }),
      }
    );
    if (!request.ok) {
      setSubmissionState("error");
      return;
    }
    const { success } = await request.json();
    if (success) {
      setSubmissionState("success");
    } else {
      setSubmissionState("error");
    }
  };

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
          <div className="flex justify-start gap-2 sticky -top-6 border-b -mx-6 -mt-6 mb-6 p-6 bg-background/50 backdrop-blur z-10 items-center">
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
            <div className="ml-auto flex gap-2 items-center">
              <Button
                onClick={() => {
                  submit();
                }}
              >
                Submit <ArrowRight />
              </Button>
            </div>
          </div>
          <div className="max-h-[calc(100vh-24rem)] overflow-auto -m-6 flex items-center gap-8 justify-center w-full py-16 px-2">
            <div className="flex flex-col gap-2 items-center">
              <div className="flex flex-row items-center gap-2 rounded-full border w-96 px-4 py-2">
                <span className="flex items-center gap-2">
                  <FileText className="size-4" />
                  Text Entry
                </span>
                <span className="text-xs text-muted-foreground flex-1 justify-end flex items-center">
                  Something goes here
                </span>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground" />
            <div className="flex items-start flex-col gap-2 w-96 border p-4 rounded-xl">
              <span className="flex gap-1 items-center pt-8">
                <Notebook className="size-4" />
                {assignment.name}
              </span>
              <span className="flex gap-1 items-center max-w-full overflow-hidden text-xs text-muted-foreground">
                <SubjectIcon
                  subject={course?.classification ?? ""}
                  className="size-4"
                />
                <span className="truncate max-w-full">
                  {course?.classification} ({course?.original_name})
                </span>
              </span>
              <span className="flex gap-1 items-center max-w-full overflow-hidden text-xs text-muted-foreground">
                <Calendar className="size-4" />
                <span className="truncate max-w-full">
                  {assignment.due_at
                    ? `${new Date(
                        assignment.due_at
                      ).toLocaleString()} in ${formatDuration(
                        Temporal.Instant.from(new Date().toISOString())
                          .until(new Date(assignment.due_at).toISOString())
                          .abs(),
                        {
                          style: "long",
                          minUnit: "second",
                          maxUnit: "day",
                          maxUnits: 2,
                        }
                      )}`
                    : "No Due Date"}
                </span>
              </span>
            </div>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }, [text, finalOpen, assignment, courses]);

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
          <div className="flex justify-start gap-2 sticky -top-6 border-b -mx-6 -mt-6 mb-6 p-6 bg-background/50 backdrop-blur z-10 items-center">
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
            <div className="ml-auto flex gap-2 items-center">
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
          <div className="max-h-[calc(100vh-24rem)] overflow-auto -m-6 flex items-center gap-2 justify-center w-full pt-16 pb-24 px-2 flex-col">
            {(() => {
              switch (submissionState) {
                case "not_yet":
                  return null;
                case "pending":
                  return (
                    <>
                      <div className="flex gap-2 items-center">
                        <Upload className="size-6" />
                        <span className="text-xl font-bold">Submitting...</span>
                      </div>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        This may take a second, please be patient.
                      </div>
                    </>
                  );
                case "error":
                  return (
                    <>
                      <div className="flex gap-2 items-center">
                        <CircleSlash className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Failed
                        </span>
                      </div>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        There was an error submitting your assignment. Please
                        try again.
                      </div>
                    </>
                  );
                case "success":
                  return (
                    <>
                      <div className="flex gap-2 items-center">
                        <CheckCircle className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Successful
                        </span>
                      </div>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
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
  }, [submissionState]);

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
                    className="justify-between w-full"
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
                  <div className="flex justify-start gap-2 sticky -top-6 border-b -mx-6 -mt-6 mb-6 p-6 bg-background/50 backdrop-blur z-10 items-center">
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
                    <div className="ml-auto flex gap-2 items-center">
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
                  <div className="max-h-[calc(100vh-24rem)] overflow-auto -m-6">
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
    [text, open, finalOpen, finalSubmission, submissionState]
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

  const submit = async () => {
    setFinalOpen(false);
    setSubmissionState("pending");
    const fileURLS: String[] = await Promise.all(
      files.map(async (file) => {
        return (
          await upload(file.name, file, {
            access: "public",
            handleUploadUrl: `/api/courses/${assignment.course_id}/assignments/${assignment.id}/submissions/submit/files/prepare`,
          })
        ).url;
      })
    );

    const request = await fetch(
      `/api/courses/${assignment.course_id}/assignments/${assignment.id}/submissions/submit/files`,
      {
        method: "POST",
        body: JSON.stringify({
          fileURLS,
        }),
      }
    );
    if (!request.ok) {
      setSubmissionState("error");
      return;
    }
    const { success } = await request.json();
    if (success) {
      setSubmissionState("success");
    } else {
      setSubmissionState("error");
    }
  };

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
          <div className="flex justify-start gap-2 sticky -top-6 border-b -mx-6 -mt-6 mb-6 p-6 bg-background/50 backdrop-blur z-10 items-center">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(true);
                setFinalOpen(false);
              }}
            >
              <ArrowLeft /> View Files
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
            <div className="ml-auto flex gap-2 items-center">
              <Button
                onClick={() => {
                  submit();
                }}
              >
                Submit <ArrowRight />
              </Button>
            </div>
          </div>
          <div className="max-h-[calc(100vh-24rem)] overflow-auto -m-6 flex items-center gap-8 justify-center w-full py-16 px-2">
            <div className="flex flex-col gap-2 items-center">
              {files.map((file) => (
                <div className="flex flex-row items-center gap-2 rounded-full border w-96 px-4 py-2">
                  <span className="flex items-center gap-2">
                    <File className="size-4" />
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground flex-1 justify-end flex items-center">
                    {prettyBytes(file.size)} - {file.type}
                  </span>
                </div>
              ))}
            </div>
            <ArrowRight className="text-muted-foreground" />
            <div className="flex items-start flex-col gap-2 w-96 border p-4 rounded-xl">
              <span className="flex gap-1 items-center pt-8">
                <Notebook className="size-4" />
                {assignment.name}
              </span>
              <span className="flex gap-1 items-center max-w-full overflow-hidden text-xs text-muted-foreground">
                <SubjectIcon
                  subject={course?.classification ?? ""}
                  className="size-4"
                />
                <span className="truncate max-w-full">
                  {course?.classification} ({course?.original_name})
                </span>
              </span>
              <span className="flex gap-1 items-center max-w-full overflow-hidden text-xs text-muted-foreground">
                <Calendar className="size-4" />
                <span className="truncate max-w-full">
                  {assignment.due_at
                    ? `${new Date(
                        assignment.due_at
                      ).toLocaleString()} in ${formatDuration(
                        Temporal.Instant.from(new Date().toISOString())
                          .until(new Date(assignment.due_at).toISOString())
                          .abs(),
                        {
                          style: "long",
                          minUnit: "second",
                          maxUnit: "day",
                          maxUnits: 2,
                        }
                      )}`
                    : "No Due Date"}
                </span>
              </span>
            </div>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }, [files, finalOpen, assignment, fileIdx, courses]);

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
          <div className="flex justify-start gap-2 sticky -top-6 border-b -mx-6 -mt-6 mb-6 p-6 bg-background/50 backdrop-blur z-10 items-center">
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
            <div className="ml-auto flex gap-2 items-center">
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
          <div className="max-h-[calc(100vh-24rem)] overflow-auto -m-6 flex items-center gap-2 justify-center w-full pt-16 pb-24 px-2 flex-col">
            {(() => {
              switch (submissionState) {
                case "not_yet":
                  return null;
                case "pending":
                  return (
                    <>
                      <div className="flex gap-2 items-center">
                        <Upload className="size-6" />
                        <span className="text-xl font-bold">Submitting...</span>
                      </div>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        This may take a second, please be patient.
                      </div>
                    </>
                  );
                case "error":
                  return (
                    <>
                      <div className="flex gap-2 items-center">
                        <CircleSlash className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Failed
                        </span>
                      </div>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        There was an error submitting your assignment. Please
                        try again.
                      </div>
                    </>
                  );
                case "success":
                  return (
                    <>
                      <div className="flex gap-2 items-center">
                        <CheckCircle className="size-6" />
                        <span className="text-xl font-bold">
                          Submission Successful
                        </span>
                      </div>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
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
  }, [submissionState]);

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
                    className="justify-between w-full"
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
                  <div className="flex justify-start gap-2 sticky -top-6 border-b -mx-6 -mt-6 mb-6 p-6 bg-background/50 backdrop-blur z-10 items-center">
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
                    <div className="ml-auto flex gap-2 items-center">
                      <div className="rounded-full border p-1 flex items-center gap-2">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setFiles(files.filter((_, i) => i != fileIdx));
                            setFileIdx((i) =>
                              Math.min(Math.max(1, i), files.length - 2)
                            );
                          }}
                          disabled={files.length == 0}
                        >
                          <Trash />
                        </Button>
                        <span className="text-xs text-muted-foreground pl-4 pr-2 flex items-center gap-1">
                          File Preview {fileIdx + 1}
                          <Slash className="size-2" />
                          {files.length}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setFileIdx((i) => i - 1)}
                          disabled={fileIdx == 0}
                        >
                          <ArrowLeft />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setFileIdx((i) => i + 1)}
                          disabled={fileIdx == files.length - 1}
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
                  <div className="max-h-[calc(100vh-24rem)] overflow-auto -m-6">
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
    [files, open, finalOpen, fileIdx, finalSubmission, submissionState]
  );

  return filePreviews;
}
