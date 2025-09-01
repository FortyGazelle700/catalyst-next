"use client";

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
import {
  type Assignment,
  type Module,
  type ModuleItem,
} from "@/server/api/canvas/types";
import {
  Upload,
  CircleSlash2,
  LayoutDashboard,
  BookOpen,
  Heading2,
  Link2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ModuleClientPage({
  modules: initialModules,
}: {
  modules: Module[];
}) {
  const [modules, setModules] = useState(initialModules);

  return (
    <div className="@container flex h-full w-full">
      <div className="flex h-full w-full flex-col-reverse items-stretch overflow-auto @4xl:flex-row @4xl:overflow-hidden">
        <div className="min-h-full flex-1 overflow-x-auto p-4 @4xl:h-[calc(100%-var(--spacing)*4)] @4xl:overflow-auto">
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
        <div className="flex items-center gap-2 rounded-2xl border p-4">
          <Heading2 className="size-4" />
          <span>{item.title}</span>
        </div>
      );
    case "Page":
      return (
        <Link href={item.html_url}>
          <div className="hover:bg-secondary flex items-center gap-2 rounded-2xl border p-4 transition-all">
            <BookOpen className="size-4" />
            <div className="items-tart flex flex-col">
              <span>{item.title}</span>
              <span className="text-muted-foreground text-xs">Page</span>
            </div>
          </div>
        </Link>
      );
    case "File":
      return (
        <Link
          href={(item.content_details as Assignment)?.html_url ?? item.html_url}
        >
          <div className="hover:bg-secondary flex items-center gap-2 rounded-2xl border p-4 transition-all">
            <Link2 className="size-4" />
            <div className="items-tart flex flex-col">
              <span>{item.title}</span>
              <span className="text-muted-foreground text-xs">Attachment</span>
            </div>
          </div>
        </Link>
      );
    case "ExternalUrl":
      return (
        <Link href={item.html_url}>
          <div className="hover:bg-secondary flex items-center gap-2 rounded-2xl border p-4 transition-all">
            <ExternalLink className="size-4" />
            <div className="items-tart flex flex-col">
              <span>{item.title}</span>
              <span className="text-muted-foreground text-xs">
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
          <div className="hover:bg-secondary flex items-center gap-2 rounded-2xl border p-4 transition-all">
            <Upload className="size-4" />
            <div className="flex flex-col items-start">
              <span>{item.title}</span>
              <span className="text-muted-foreground text-xs">Assignment</span>
            </div>
          </div>
        </Link>
      );
    default:
      return (
        <div className="flex items-center gap-2 rounded-2xl border p-4">
          <CircleSlash2 className="size-4" />
          <span>Cannot render {item.type}</span>
        </div>
      );
  }
}

function ModuleSidebar({
  modules: _m,
  setModules: _sM,
  initialModules: _iM,
}: {
  modules: Module[];
  setModules: (modules: Module[]) => void;
  initialModules: Module[];
}) {
  // const now = useContext(TimeContext);

  return (
    <>
      <Sidebar
        collapsible="none"
        className="scrollbar-auto m-2 min-h-max w-[calc(100%-1rem)] overflow-auto rounded-xs @4xl:h-[calc(100%-var(--spacing)*4)] @4xl:w-[20rem]"
      >
        <SidebarHeader className="p-4">
          <h1 className="flex items-center gap-1 text-2xl font-bold">
            <LayoutDashboard /> Modules
          </h1>
        </SidebarHeader>
        <SidebarContent className="px-4">
          <SidebarGroup>sidebar group</SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
