"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { useState, Dispatch, SetStateAction } from "react";

export default function TodoPage() {
  const [sort, setSort] = useState([
    "date",
    "course",
    "completed",
    "title",
    "description",
  ]);

  return (
    <div className="flex w-full h-full items-stretch">
      <div className="flex-1">
        <Reorder.Group
          axis="y"
          values={sort}
          onReorder={setSort}
          // className="relative flex flex-col gap-2"
        >
          {sort.map((item) => (
            <SortItem key={item} item={item} setOrder={setSort} />
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

function SortItem({
  item,
  setOrder,
}: {
  item: string;
  setOrder: Dispatch<SetStateAction<string[]>>;
}) {
  const [active, setActive] = useState(false);
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={item}
      value={item}
      id={item}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "border px-2 py-1 rounded-full flex items-center gap-1 h-10 relative bg-sidebar select-none !z-0",
        active && "!z-10"
      )}
      data-active={active}
    >
      <div
        onPointerDown={(e) => {
          setActive(true);
          controls.start(e);
        }}
        onPointerUp={() => setActive(false)}
        className="size-6 rounded-full bg-secondary grid place-items-center"
      >
        <GripVertical className="size-3 cursor-move" />
      </div>
      <span className="px-2 text-xs py-0.5">{item}</span>
      <div className="ml-auto flex gap-1">
        <Button
          variant="outline"
          size="icon"
          className="bg-transparent size-6"
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
          className="bg-transparent size-6"
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
