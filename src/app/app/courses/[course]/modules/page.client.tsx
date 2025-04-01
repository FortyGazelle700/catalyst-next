"use client";

import { TimeContext } from "@/app/app/layout.providers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  Sidebar,
} from "@/components/ui/sidebar";
import { Assignment, Module, ModuleItem } from "@/server/api/canvas/types";
import {
  Notebook,
  Info,
  Calendar,
  Timer,
  Minus,
  CheckCircle,
  Percent,
  Tally5,
  Upload,
  ArrowUp,
  ArrowUpLeft,
  CircleSlash2,
  ArrowLeft,
  ArrowDownLeft,
  ArrowDown,
  LayoutDashboard,
  BookOpen,
  Heading1,
  Heading2,
  Link2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";

export default function ModuleClientPage({
  modules: initialModules,
}: {
  modules: Module[];
}) {
  const [modules, setModules] = useState(initialModules);

  return (
    <div className="flex w-full h-full @container">
      <div className="flex w-full h-full items-stretch @4xl:flex-row flex-col-reverse overflow-auto @4xl:overflow-hidden">
        <div className="flex-1 @4xl:overflow-auto p-4 overflow-x-auto min-h-full @4xl:h-[calc(100%-var(--spacing)*4)]">
          <h1 className="h1 mb-2">Modules</h1>
          <ModuleList modules={modules} />
        </div>
        <ModuleSidebar
          modules={modules}
          setModules={setModules}
          initialModules={initialModules}
        />
      </div>
    </div>
  );
}

function ModuleList({ modules }: { modules: Module[] }) {
  return (
    <Accordion type="multiple">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </Accordion>
  );
}

function ModuleCard({ module }: { module: Module }) {
  return (
    <AccordionItem value={String(module.id)}>
      <AccordionTrigger>{module.name}</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-2">
        {module.items?.map((item) => (
          <ModuleItemRenderer key={item.id} item={item} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function ModuleItemRenderer({ item }: { item: ModuleItem }) {
  switch (item.type) {
    case "SubHeader":
      return (
        <div className="flex gap-2 items-center rounded-2xl p-4 border">
          <Heading2 className="size-4" />
          <span>{item.title}</span>
        </div>
      );
    case "Page":
      return (
        <Link href={item.html_url}>
          <div className="flex items-center rounded-2xl p-4 border gap-2 hover:bg-secondary transition-all">
            <BookOpen className="size-4" />
            <div className="flex flex-col items-tart">
              <span>{item.title}</span>
              <span className="text-xs text-muted-foreground">Page</span>
            </div>
          </div>
        </Link>
      );
    case "File":
      return (
        <Link
          href={(item.content_details as Assignment)?.html_url ?? item.html_url}
        >
          <div className="flex items-center rounded-2xl p-4 border gap-2 hover:bg-secondary transition-all">
            <Link2 className="size-4" />
            <div className="flex flex-col items-tart">
              <span>{item.title}</span>
              <span className="text-xs text-muted-foreground">Attachment</span>
            </div>
          </div>
        </Link>
      );
    case "ExternalUrl":
      return (
        <Link href={item.html_url}>
          <div className="flex items-center rounded-2xl p-4 border gap-2 hover:bg-secondary transition-all">
            <ExternalLink className="size-4" />
            <div className="flex flex-col items-tart">
              <span>{item.title}</span>
              <span className="text-xs text-muted-foreground">
                External Link
              </span>
            </div>
          </div>
        </Link>
      );
    case "assignment":
    case "Assignment":
      return (
        <Link
          href={
            (item.content_details as Assignment)?.html_url ?? item?.html_url
          }
        >
          <div className="flex items-center rounded-2xl p-4 border gap-2 hover:bg-secondary transition-all">
            <Upload className="size-4" />
            <div className="flex flex-col items-start">
              <span>{item.title}</span>
              <span className="text-xs text-muted-foreground">Assignment</span>
            </div>
          </div>
        </Link>
      );
    default:
      return (
        <div className="flex gap-2 items-center rounded-2xl p-4 border">
          <CircleSlash2 className="size-4" />
          <span>Cannot render {item.type}</span>
        </div>
      );
  }
}

function ModuleSidebar({
  modules,
  setModules,
  initialModules,
}: {
  modules: Module[];
  setModules: (modules: Module[]) => void;
  initialModules: Module[];
}) {
  const now = useContext(TimeContext);

  return (
    <>
      <Sidebar
        collapsible="none"
        className="rounded-xs m-2 min-h-max @4xl:h-[calc(100%-var(--spacing)*4)] overflow-auto scrollbar-auto w-[calc(100%-1rem)] @4xl:w-[20rem]"
      >
        <SidebarHeader>
          <h1 className="font-bold text-2xl flex items-center gap-1">
            <LayoutDashboard /> Modules
          </h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>sidebar group</SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
