"use client";

import { formatDuration } from "@/components/catalyst/format-duration";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/server/api/canvas/types";
import { Temporal } from "@js-temporal/polyfill";
import { Dot, MessageCircle, Send, Loader, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextEditor } from "@/components/editor/editor.dynamic";
import { Button } from "@/components/ui/button";
import { Converter } from "showdown";

export function ChatsClientPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container h-full w-full">
      <div className="flex h-full w-full flex-col-reverse items-stretch @4xl:flex-row">
        <div className="min-w-0 flex-1">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <ChatList />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <ChatsSidebar />
      </div>
    </div>
  );
}

function ChatList() {
  const params = useParams<{ message: string }>();
  const [items, setItems] = useState<Conversation[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const cursor = useRef(1);
  const limit = useRef(10);

  const isFetching = useRef(false);

  const fetchData = () => {
    (async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      if (!hasMore) return;
      cursor.current++;
      const req = await fetch(
        `/api/canvas/chats/canvas/list?cursor=${cursor.current}&limit=${limit.current}`,
      );
      const data = (await req.json()) as {
        success: boolean;
        data: Conversation[];
        errors?: { message: string }[];
      };
      setHasMore(data.data.length >= limit.current);
      if (data.success) {
        setItems((prevItems) => [
          ...prevItems,
          ...data.data.slice(0, limit.current),
        ]);
      }
      isFetching.current = false;
    })().catch(console.error);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <InfiniteScroll
        next={fetchData}
        hasMore={hasMore}
        loader={
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-24 w-full shrink-0 rounded-md"
              />
            ))}
          </>
        }
        end={<div className="p-4 text-center">No more chats</div>}
        className="w-full p-4"
      >
        <ul className="flex w-full flex-col gap-2">
          {items.map((item) => (
            <Button
              key={item.id}
              variant={
                params.message == String(item.id) ? "secondary" : "outline"
              }
              href={`/app/social/chats/canvas/${item.id}`}
              className="@container h-auto flex-col items-start rounded-xs border-1"
            >
              <h2 className="flex w-full items-center">
                <div className="mr-2 size-6 shrink-0 overflow-hidden rounded-full border">
                  <img src={item.avatar_url} alt={item.subject} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                  <div className="block w-full truncate pr-8 font-bold">
                    {item.subject ?? "<no subject>"}
                  </div>
                  <div className="text-muted-foreground w-full truncate pr-16 text-xs font-bold">
                    {item
                      .participants!.filter((_, idx) => idx < 3)
                      .map((participant) => participant.full_name)
                      .join(", ")}
                    {item.participants!.length === 2
                      ? ""
                      : item.participants!.length === 3
                        ? ""
                        : `, and ${item.participants!.length - 3} others`}
                  </div>
                </div>
                <span className="text-muted-foreground flex shrink-0 items-center gap-1 truncate text-xs">
                  <span className="hidden @xl:inline">
                    {formatDuration(
                      Temporal.Duration.from({
                        milliseconds:
                          Date.now() - new Date(item.last_message_at).getTime(),
                      }),
                      {
                        maxUnits: 1,
                        hideUnnecessaryUnits: true,
                      },
                    )}{" "}
                    ago
                  </span>
                  <Dot className="hidden @xl:inline" />
                  <span className="hidden @lg:inline">
                    {new Date(item.last_message_at).toLocaleString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </span>
                  <span className="inline @lg:hidden">
                    {new Date(item.last_message_at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </span>
                </span>
              </h2>
              <span className="text-muted-foreground w-full truncate">
                {item.last_message?.split(
                  "________________________________",
                )?.[0] ?? "<no content>"}
              </span>
            </Button>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
}

function ChatsSidebar() {
  return (
    <>
      <Sidebar
        collapsible="none"
        className="sticky top-0 m-2 h-[3.5rem] w-[calc(100%-1rem)] flex-row items-center rounded-xs @4xl:h-[calc(100%-var(--spacing)*4)] @4xl:w-[20rem] @4xl:flex-col @4xl:items-start"
      >
        <SidebarHeader>
          <h1 className="flex items-center gap-1 pr-4 pl-2 text-2xl font-bold">
            <MessageCircle /> Chats
          </h1>
        </SidebarHeader>
        <SidebarContent className="flex-row overflow-auto @4xl:flex-col">
          <SidebarGroup className="mt-auto min-w-max flex-row items-center @4xl:w-[20rem] @4xl:min-w-auto @4xl:flex-col @4xl:items-start">
            {/*<SidebarGroupLabel className="flex items-center gap-1 px-4">
              <Search className="size-3" /> Search
            </SidebarGroupLabel>*/}
            <SidebarMenu>
              <Button href="/app/social/chats/canvas/compose">
                <Plus /> Compose
              </Button>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}

function InfiniteScroll({
  next = () => {
    /**/
  },
  hasMore = true,
  loader = null,
  end = null,
  children,
  className,
  debug = false,
}: {
  next: () => void;
  hasMore: boolean;
  loader: React.ReactNode;
  end: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  debug?: boolean;
}) {
  const scrollingMessages = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(
    Number(
      typeof window != "undefined" && localStorage.getItem("scrollingMessages"),
    ),
  );
  const [isLoadingNewPage, setIsLoadingNewPage] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observedEl = useRef<HTMLDivElement[]>([]);
  const loadMoreDiv = useCallback((node: HTMLDivElement) => {
    setIsLoadingNewPage(false);
    observedEl.current.forEach((el) => {
      observer.current!.unobserve(el);
    });
    if (node !== null) {
      observer.current!.observe(node);
      observedEl.current.push(node);
    }
  }, []);

  const observer = useRef(
    typeof window !== "undefined"
      ? new IntersectionObserver((entries) => {
          setIsIntersecting(entries.some((entry) => entry.isIntersecting));
        })
      : undefined,
  );

  useEffect(() => {
    if (scrollingMessages.current) {
      scrollingMessages.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  useEffect(() => {
    if (!isIntersecting) return;
    setIsLoadingNewPage(true);
    next();
  }, [next, isIntersecting]);

  useEffect(() => {
    localStorage.setItem("scrollingMessages", String(scrollTop));
  }, [scrollTop]);

  return (
    <div
      className="relative h-full w-full overflow-auto"
      ref={scrollingMessages}
      onScroll={(evt) => {
        setScrollTop(evt.currentTarget.scrollTop);
      }}
    >
      <div className={cn("relative flex h-max flex-col gap-1", className)}>
        {children}
        {hasMore && (
          <div
            key="load-more"
            ref={loadMoreDiv}
            className={cn(
              "absolute bottom-0 h-[120rem] w-0",
              debug && "w-20 bg-red-500",
            )}
          />
        )}
        {hasMore && isLoadingNewPage && loader}
        {!hasMore && end}
      </div>
    </div>
  );
}

export function ComposeNew({
  messageId,
  subject,
  context,
  participants,
}: {
  messageId?: number;
  subject?: string;
  context?: number;
  participants?: number[];
}) {
  const [isPending, setIsPending] = useState(false);
  const [content, setContent] = useState("");
  const converter = new Converter();

  const send = async ({
    conversationId,
    body,
  }: {
    conversationId: number;
    body: string;
  }) => {
    setIsPending(true);
    if (messageId != undefined) {
      await fetch(`/api/canvas/chats/canvas/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: conversationId,
          body,
        }),
      });
    } else {
      await fetch(`/api/canvas/chats/canvas/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject,
          body,
          contextId: context,
          participants: participants ?? [],
        }),
      });
    }
    setIsPending(false);
  };

  const _ = () => {
    /* */
  };

  return (
    <div className="flex flex-col gap-4">
      <TextEditor
        saveId={`inbox-draft-${messageId}`}
        content={content}
        setMarkdown={_}
        setContent={setContent}
      />
      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={async () => {
            await send({
              conversationId: messageId!,
              body: converter
                .makeMarkdown(
                  content

                    .replaceAll("<sup>", "^{")
                    .replaceAll("</sup>", "}")
                    .replaceAll("<sub>", "_{")
                    .replaceAll("</sub>", "}")
                    .replaceAll(
                      '<span data-name="crossed_fingers" data-type="emoji">',
                      "",
                    )
                    .replaceAll("</span>", ""),
                )
                .replaceAll("\n\n", "\n"),
            });
          }}
          disabled={isPending}
        >
          {isPending ? (
            <>
              Sending <Loader className="animate-spin" />
            </>
          ) : (
            <>
              Send <Send />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
