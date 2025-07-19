"use client";

import { DateTimePicker } from "@/components/catalyst/date-time-picker";
import MultiSelect from "@/components/catalyst/multi-select";
import { PrettyState } from "@/components/catalyst/pretty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  CircleX,
  Search,
  SortDesc,
} from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import Textarea from "react-expanding-textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { type PlannerItem } from "@/server/api/canvas/types";
import { TodoItem } from "../todo";

export function TodoClientPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState(getStart());
  const [end, setEnd] = useState(getEnd());
  const [completed, setCompleted] = useState<"yes" | "no" | "all">("all");
  const [status, setStatus] = useState<string[]>([
    "graded",
    "submitted",
    "unsubmitted",
    "",
  ]);
  const [sort, setSort] = useState([
    "date",
    "course",
    "completed",
    "status",
    "title",
    "description",
  ]);

  return (
    <div className="@container h-full w-full">
      <div className="flex h-full w-full flex-col-reverse items-stretch @4xl:flex-row">
        <div className="flex-1 overflow-auto p-4">
          <TodoList
            title={title}
            description={description}
            start={start}
            end={end}
            completed={completed}
            status={status}
            sort={sort}
          />
        </div>
        <TodoSidebar
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
          completed={completed}
          setCompleted={setCompleted}
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
        />
      </div>
    </div>
  );
}

function TodoSidebar({
  title,
  setTitle,
  description,
  setDescription,
  start,
  setStart,
  end,
  setEnd,
  completed,
  setCompleted,
  status,
  setStatus,
  sort,
  setSort,
}: {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  start: Date;
  setStart: Dispatch<SetStateAction<Date>>;
  end: Date;
  setEnd: Dispatch<SetStateAction<Date>>;
  completed: "yes" | "no" | "all";
  setCompleted: Dispatch<SetStateAction<"yes" | "no" | "all">>;
  status: string[];
  setStatus: Dispatch<SetStateAction<string[]>>;
  sort: string[];
  setSort: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <>
      <Sidebar
        collapsible="none"
        className="sticky top-0 m-2 h-[3.5rem] w-[calc(100%-1rem)] flex-row items-center rounded-xs @4xl:h-[calc(100%-var(--spacing)*4)] @4xl:w-[20rem] @4xl:flex-col @4xl:items-start"
      >
        <SidebarHeader>
          <h1 className="flex items-center gap-1 pr-4 pl-2 text-2xl font-bold">
            <CheckCircle /> Todo List
          </h1>
        </SidebarHeader>
        <SidebarContent className="flex-row overflow-auto @4xl:flex-col">
          <SidebarGroup className="min-w-max flex-row items-center @4xl:w-[20rem] @4xl:min-w-auto @4xl:flex-col @4xl:items-start">
            <SidebarGroupLabel className="flex items-center gap-1 px-4 @4xl:px-0">
              <Search className="size-3" /> Search
            </SidebarGroupLabel>
            <SidebarMenu className="flex-row @4xl:flex-col">
              <label className="flex h-10 w-[15rem] items-center gap-1 rounded-full border px-2 py-1 @4xl:w-[19rem]">
                <span className="bg-secondary rounded-full px-2 py-0.5 text-center text-xs">
                  title
                </span>
                <input
                  className="h-full flex-1 text-xs outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label className="flex min-h-10 w-[15rem] items-start gap-1 rounded-full border px-2 py-1 @4xl:w-[19rem]">
                <span className="bg-secondary mt-1 rounded-full px-2 py-0.5 text-center text-xs">
                  description
                </span>
                <Textarea
                  className="h-full max-h-[5rem] flex-1 resize-none pt-1.5 text-xs outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <DateTimePicker
                defaultDate={start.toISOString()}
                setDate={setStart}
                custom
                side="right"
                align="start"
              >
                <label className="flex h-10 w-[15rem] items-center gap-1 rounded-full border px-2 py-1 @4xl:w-[19rem]">
                  <span className="bg-secondary rounded-full px-2 py-0.5 text-center text-xs">
                    start
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {start.toLocaleString()}
                  </span>
                </label>
              </DateTimePicker>
              <DateTimePicker
                defaultDate={end.toISOString()}
                setDate={setEnd}
                custom
                side="right"
                align="start"
              >
                <label className="flex h-10 w-[15rem] items-center gap-1 rounded-full border px-2 py-1 @4xl:w-[19rem]">
                  <span className="bg-secondary rounded-full px-2 py-0.5 text-center text-xs">
                    end
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {end.toLocaleString()}
                  </span>
                </label>
              </DateTimePicker>
              <label className="flex h-10 w-[15rem] items-center gap-1 rounded-full border px-2 py-1 @4xl:w-[19rem]">
                <span className="bg-secondary rounded-full px-2 py-0.5 text-center text-xs">
                  completed
                </span>
                <span className="text-muted-foreground flex-1 text-xs">
                  <Select
                    value={completed}
                    onValueChange={(val) =>
                      setCompleted(val as "yes" | "no" | "all")
                    }
                  >
                    <SelectTrigger className="bg-sidebar w-full border-0 px-0 text-xs shadow-none">
                      <button>
                        {completed === "yes"
                          ? "Yes"
                          : completed === "no"
                            ? "No"
                            : "Either"}
                      </button>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="all">Either</SelectItem>
                    </SelectContent>
                  </Select>
                </span>
              </label>
              <label className="flex h-10 w-[15rem] items-center gap-1 rounded-full border px-2 py-1 @4xl:w-[19rem]">
                <span className="bg-secondary rounded-full px-2 py-0.5 text-center text-xs">
                  status
                </span>
                <span className="text-muted-foreground flex-1 text-xs">
                  <MultiSelect
                    render={
                      <div className="flex items-center gap-1 text-xs">
                        {(() => {
                          if (status.length == 0) return "None";
                          if (status.length == 1)
                            return (
                              <PrettyState
                                state={status[0] ?? ""}
                                className="size-3"
                              />
                            );
                          if (status.length == 4) return "All";
                          return `${status.length} selected`;
                        })()}
                      </div>
                    }
                    options={[
                      {
                        type: "option",
                        render: <PrettyState state="graded" />,
                        value: "graded",
                      },
                      {
                        type: "option",
                        render: <PrettyState state="submitted" />,
                        value: "submitted",
                      },
                      {
                        type: "option",
                        render: <PrettyState state="unsubmitted" />,
                        value: "unsubmitted",
                      },
                      {
                        type: "option",
                        render: <PrettyState state="" />,
                        value: "",
                      },
                      {
                        type: "separator",
                      },
                      {
                        type: "option",
                        render: (
                          <>
                            <CircleCheckBig /> All
                          </>
                        ),
                        value: "all",
                        checked: status.length == 4,
                        onSelect: () =>
                          status.length == 4
                            ? setStatus([])
                            : setStatus([
                                "graded",
                                "submitted",
                                "unsubmitted",
                                "",
                              ]),
                      },
                      {
                        type: "option",
                        render: (
                          <>
                            <CircleX /> None
                          </>
                        ),
                        value: "none",
                        checked: status.length == 0,
                        onSelect: () =>
                          status.length == 4
                            ? setStatus([])
                            : setStatus([
                                "graded",
                                "submitted",
                                "unsubmitted",
                                "",
                              ]),
                      },
                    ]}
                    selectedOptions={status}
                    setSelectedOptions={setStatus}
                    custom
                  />
                </span>
              </label>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="min-w-max flex-row items-center @4xl:w-[20rem] @4xl:min-w-auto @4xl:flex-col @4xl:items-start">
            <SidebarGroupLabel className="flex items-center gap-1">
              <SortDesc className="size-3" /> Sort
            </SidebarGroupLabel>
            <SidebarMenu className="flex-row @4xl:flex-col">
              <Reorder.Group
                values={sort}
                onReorder={setSort}
                className="relative flex flex-row gap-2 @4xl:flex-col"
              >
                {sort.map((item) => (
                  <SortItem key={item} item={item} setOrder={setSort} />
                ))}
              </Reorder.Group>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}

function SortItem({
  item,
  setOrder,
}: {
  item: string;
  setOrder: Dispatch<SetStateAction<string[]>>;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={item}
      value={item}
      id={item}
      dragListener={false}
      dragControls={controls}
      className={
        "bg-sidebar relative flex h-10 w-[15rem] items-center gap-1 rounded-full border px-2 py-1 select-none @4xl:w-[19rem]"
      }
    >
      {/* <div
        onPointerDown={(e) => 
          controls.start(e);
        }
        className="size-6 rounded-full bg-secondary grid place-items-center"
      >
        <GripVertical className="size-3 cursor-move" />
      </div> */}
      <span className="px-2 py-0.5 text-xs">{item}</span>
      <div className="ml-auto flex gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-6 bg-transparent"
          onClick={() =>
            setOrder((order) => {
              const index = order.indexOf(item);
              if (index === 0) return order;
              const newSort = [...order];
              newSort[index] = order[index - 1] ?? item;
              newSort[index - 1] = item;
              return newSort;
            })
          }
        >
          <ChevronUp />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-6 bg-transparent"
          onClick={() =>
            setOrder((order) => {
              const index = order.indexOf(item);
              if (index === order.length - 1) return order;
              const newSort = [...order];
              newSort[index] = order[index + 1] ?? item;
              newSort[index + 1] = item;
              return newSort;
            })
          }
        >
          <ChevronDown />
        </Button>
      </div>
    </Reorder.Item>
  );
}

function getStart() {
  const d = new Date();
  d.setDate(d.getDate());
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEnd() {
  const d = new Date();
  d.setDate(d.getDate() + 14 + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function TodoList({
  title,
  description,
  start,
  end,
  completed,
  status,
  sort,
}: {
  title: string;
  description: string;
  start: Date;
  end: Date;
  completed: "yes" | "no" | "all";
  status: string[];
  sort: string[];
}) {
  const [loading, setLoading] = useState(true);
  const [todoItems, setTodoItems] = useState<PlannerItem[]>([]);

  useEffect(() => {
    setLoading(true);
  }, [title, description, start, end, completed, status, sort]);

  useEffect(() => {
    (async () => {
      const req = await fetch("/api/todo/list", {
        method: "POST",
        body: JSON.stringify({
          search: {
            title: title,
            description: description,
            start: start.toISOString(),
            end: end.toISOString(),
            completed: completed,
            courses: [],
            status,
          },
          sort,
        }),
      });
      const res = (await req.json()) as {
        success: boolean;
        data: PlannerItem[];
        errors: { message: string }[];
      };
      setTodoItems(res.data);
      setLoading(false);
    })().catch(console.error);
  }, [title, description, start, end, completed, status, sort]);

  return (
    <div className="@container mt-4 flex flex-col gap-4">
      {loading ? (
        <>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={`mini-todo-${idx}`} className="h-96 @3xl:h-52" />
          ))}
        </>
      ) : (
        <>
          {todoItems.map((todoItem) => (
            <TodoItem
              key={todoItem.plannable_id}
              todoItem={todoItem}
              setTodoItems={setTodoItems}
            />
          ))}
        </>
      )}
    </div>
  );
}
