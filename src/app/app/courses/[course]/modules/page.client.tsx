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
  SidebarGroupLabel,
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
  Search,
  ChevronsUpDown,
  ChevronsDownUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ModuleClientPage({
  modules: initialModules,
}: {
  modules: Module[];
}) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [search, setSearch] = useState<string>("");
  const [openModules, setOpenModules] = useState<string[]>([]);

  // Filter modules and items based on search
  const filteredModules: Module[] = search.trim()
    ? initialModules
        .map((module: Module) => {
          // Check if module name matches
          const moduleMatch = module.name
            .toLowerCase()
            .includes(search.toLowerCase());
          // Filter items
          const filteredItems = (module.items ?? []).filter(
            (item: ModuleItem) => {
              return (
                item.title?.toLowerCase().includes(search.toLowerCase()) ||
                item.type?.toLowerCase().includes(search.toLowerCase())
              );
            },
          );
          if (moduleMatch || filteredItems.length > 0) {
            return {
              ...module,
              items: moduleMatch ? module.items : filteredItems,
            };
          }
          return null;
        })
        .filter((m: Module | null): m is Module => !!m)
    : modules;

  // When searching, open all modules
  const accordionOpen: string[] = search.trim()
    ? filteredModules.map((m: Module) => String(m.id))
    : openModules;

  // Collapse/Expand all modules
  const handleExpandAll = () => {
    setOpenModules(filteredModules.map((m: Module) => String(m.id)));
  };
  const handleCollapseAll = () => {
    setOpenModules([]);
  };

  return (
    <div className="@container flex h-full w-full">
      <div className="flex h-full w-full flex-col-reverse items-stretch overflow-auto @4xl:flex-row @4xl:overflow-hidden">
        <div className="min-h-full flex-1 overflow-x-auto p-4 @4xl:h-[calc(100%-var(--spacing)*4)] @4xl:overflow-auto">
          <h1 className="h1 mb-2">Modules</h1>
          <ModuleList
            modules={filteredModules}
            open={accordionOpen}
            setOpen={setOpenModules}
          />
        </div>
        <ModuleSidebar
          modules={modules}
          setModules={setModules}
          initialModules={initialModules}
          search={search}
          setSearch={setSearch}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />
      </div>
    </div>
  );
}

function ModuleList({
  modules,
  open,
  setOpen,
}: {
  modules: Module[];
  open: string[];
  setOpen: (ids: string[]) => void;
}) {
  return (
    <Accordion type="multiple" value={open} onValueChange={setOpen}>
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
          href={(
            (item.content_details as Assignment)?.html_url ?? item.html_url
          ).replace("/api/v1/", "")}
          target="_blank"
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
        <Link href={item.external_url ?? item.html_url} target="_blank">
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
  search,
  setSearch,
  onExpandAll,
  onCollapseAll,
}: {
  modules: Module[];
  setModules: (modules: Module[]) => void;
  initialModules: Module[];
  search: string;
  setSearch: (val: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) {
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
        <SidebarContent className="flex flex-col gap-4 px-4">
          <SidebarGroup>
            <SidebarGroupLabel>
              <Search /> Search
            </SidebarGroupLabel>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Daily Work & Prep Work"
              className="mb-2"
            />
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <ChevronsUpDown /> Collapsible Actions
            </SidebarGroupLabel>
            <div className="flex w-full items-center gap-2 [&>*]:flex-1">
              <Button variant="outline" onClick={onExpandAll}>
                <ChevronsUpDown />
                Expand All
              </Button>
              <Button variant="outline" onClick={onCollapseAll}>
                <ChevronsDownUp />
                Collapse All
              </Button>
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
