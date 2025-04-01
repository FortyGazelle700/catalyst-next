import { cn } from "@/lib/utils";
import {
  CheckCheck,
  Check,
  CircleX,
  HelpCircle,
  Camera,
  CircleSlash,
  FileText,
  Link2,
  Newspaper,
  SquareArrowOutUpRight,
  SquareCheck,
  Upload,
} from "lucide-react";

export function PrettyState({
  state,
  className,
}: {
  state: string;
  className?: string;
}) {
  switch (state.toLowerCase()) {
    case "graded":
      return (
        <>
          <CheckCheck className={cn(className)} /> Graded
        </>
      );
    case "submitted":
      return (
        <>
          <Check className={cn(className)} /> Submitted
        </>
      );
    case "unsubmitted":
      return (
        <>
          <CircleX className={cn(className)} /> Not Submitted
        </>
      );
    case "":
      return (
        <>
          <CircleX className={cn(className)} /> Not Submitted (Inferred)
        </>
      );
    default:
      return (
        <>
          <HelpCircle className={cn(className)} /> {state}
        </>
      );
  }
}

export function SubmissionType({ submission }: { submission: string }) {
  switch (submission.toLowerCase()) {
    case "online_text_entry":
      return <>Text Entry</>;
    case "online_upload":
      return <>File Upload</>;
    case "external_tool":
      return <>External Tool</>;
    case "on_paper":
      return <>On Paper</>;
    case "quiz":
    case "online_quiz":
      return <>Quiz</>;
    case "online_url":
      return <>URL</>;
    case "none":
      return <>Nothing</>;
    default:
      return <>{submission}</>;
  }
}

export function SubmissionTypeWithIcon({
  className,
  submission,
}: {
  className?: string;
  submission: string;
}) {
  switch (submission.toLowerCase()) {
    case "online_text_entry":
      return (
        <>
          <FileText className={cn(className)} /> Text Entry
        </>
      );
    case "online_upload":
      return (
        <>
          <Upload className={cn(className)} /> File Upload
        </>
      );
    case "media_recording":
      return (
        <>
          <Camera className={cn(className)} /> Media Recording
        </>
      );
    case "on_paper":
      return (
        <>
          <Newspaper className={cn(className)} /> On Paper
        </>
      );
    case "external_tool":
      return (
        <>
          <SquareArrowOutUpRight className={cn(className)} /> External Tool
        </>
      );
    case "quiz":
    case "online_quiz":
      return (
        <>
          <SquareCheck className={cn(className)} /> Quiz
        </>
      );
    case "online_url":
      return (
        <>
          <Link2 className={cn(className)} /> URL
        </>
      );
    case "":
    case "none":
      return (
        <>
          <CircleSlash className={cn(className)} /> Nothing
        </>
      );
    default:
      return (
        <>
          <HelpCircle className={cn(className)} />
          {submission}
        </>
      );
  }
}
