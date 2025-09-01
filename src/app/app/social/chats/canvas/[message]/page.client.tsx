"use client";

import { AttachmentPreview } from "@/components/catalyst/attachment";
import { UserAvatar } from "@/components/catalyst/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Converter } from "showdown";
import { ComposeNew } from "../page.client";
import type { ConversationDetailed } from "@/server/api/canvas/types";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "@/components/catalyst/format-duration";
import { Temporal } from "@js-temporal/polyfill";

export default function MessageItem({
  message,
  messageDetails,
  userId,
}: {
  message: string;
  messageDetails: ConversationDetailed;
  userId: number;
}) {
  const converter = useRef(
    new Converter({
      simplifiedAutoLink: true,
      openLinksInNewWindow: true,
    }),
  );
  const [attachments, setAttachments] = useState<Record<string, File>>({});
  const you = useRef(
    messageDetails.participants.find((part) => part.id == userId),
  );

  const exe = useRef(false);

  useEffect(() => {
    if (exe.current) return;
    exe.current = true;
    (async () => {
      for (const message of messageDetails.messages) {
        for (const attachment of message.attachments) {
          const bits = await (await fetch(attachment.url)).blob();
          const file = new File([bits], attachment.filename, {
            type: bits.type,
            endings: "native",
          });
          setAttachments((attachments) => ({
            ...attachments,
            [attachment.filename]: file,
          }));
        }
      }
    })().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-h-full overflow-auto">
      {messageDetails.messages
        .sort((a, b) =>
          Number(new Date(a.created_at)) > Number(new Date(b.created_at))
            ? 1
            : -1,
        )
        .map((message, idx) => (
          <div className="@container" key={message.id}>
            <div className="hidden flex-col gap-2 @[1rem]:flex">
              <div className="-mt-[1px] flex w-full flex-col items-center justify-between gap-2 border-y p-4 @md:flex-row">
                <h3 className="h4 flex w-full items-center gap-4 @md:w-auto">
                  <UserAvatar
                    name={
                      messageDetails.participants.find(
                        (part) => part.id == message.author_id,
                      )?.full_name ?? "Unknown"
                    }
                    image={
                      messageDetails.participants.find(
                        (part) => part.id == message.author_id,
                      )?.avatar_url
                    }
                    className="size-10"
                  />
                  <div className="flex w-full flex-col overflow-hidden">
                    <div className="truncate">
                      {messageDetails.participants
                        .find((part) => part.id == message.author_id)
                        ?.full_name.split(" ")
                        .map((name) =>
                          name
                            .split("")
                            .map((letter, idx) =>
                              idx == 0
                                ? letter.toUpperCase()
                                : letter.toLowerCase(),
                            )
                            .join(""),
                        )
                        .join(" ") ?? "Unknown"}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      Sent in {messageDetails.context_name ?? "Unknown"}
                    </div>
                  </div>
                </h3>
                <span className="text-muted-foreground flex flex-row items-end gap-4 text-right text-xs @md:flex-col @md:gap-1">
                  {(() => {
                    switch (idx) {
                      case 0:
                        return (
                          <Badge variant="secondary" className="w-max">
                            First Message
                          </Badge>
                        );
                      case messageDetails.messages.length - 1:
                        return (
                          <Badge variant="secondary" className="w-max">
                            Latest Message
                          </Badge>
                        );
                      default:
                        return <></>;
                    }
                  })()}
                  <div>{new Date(message.created_at).toLocaleString()}</div>
                  <div>
                    {formatDuration(
                      Temporal.Duration.from({
                        milliseconds:
                          Date.now() - new Date(message.created_at).getTime(),
                      }),
                      { maxUnits: 1 },
                    )}{" "}
                    ago
                  </div>
                </span>
              </div>
              {message.body && (
                <div
                  className="render-fancy p-4"
                  dangerouslySetInnerHTML={{
                    __html: converter.current
                      .makeHtml(
                        message.body.split(
                          "________________________________",
                        )[0]!,
                      )
                      .replaceAll("\r", "")
                      .replaceAll("\n", "<br />"),
                  }}
                />
              )}
              {message.attachments.length > 0 && (
                <>
                  <h3 className="h4 p-4 pb-2">Attachments</h3>
                  <div className="flex gap-2 overflow-auto px-4 pb-4">
                    {message.attachments.map(async (attachment) =>
                      attachments[attachment.filename] ? (
                        <AttachmentPreview
                          attachment={attachments[attachment.filename]!}
                          key={attachment.filename}
                        />
                      ) : (
                        <>loading...</>
                      ),
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      <div className="@container">
        <div className="hidden flex-col gap-2 @[1rem]:flex">
          <div className="flex w-full flex-col items-center justify-between gap-2 border-y p-4 @md:flex-row">
            <h3 className="h4 flex w-full items-center gap-4 @md:w-auto">
              <UserAvatar
                name={
                  messageDetails.participants.find(
                    (part) => part.id == (you.current?.id ?? userId),
                  )?.full_name ?? "Unknown"
                }
                image={
                  messageDetails.participants.find(
                    (part) => part.id == (you.current?.id ?? userId),
                  )?.avatar_url
                }
                className="size-10"
              />
              <div className="flex w-full flex-col overflow-hidden">
                <div className="truncate">
                  {messageDetails.participants
                    .find((part) => part.id == (you.current?.id ?? userId))
                    ?.full_name.split(" ")
                    .map((name) =>
                      name
                        .split("")
                        .map((letter, idx) =>
                          idx == 0
                            ? letter.toUpperCase()
                            : letter.toLowerCase(),
                        )
                        .join(""),
                    )
                    .join(" ") ?? "Unknown"}
                </div>
                <div className="text-muted-foreground truncate text-xs">
                  Sent in {messageDetails.context_name ?? "Unknown"}
                </div>
              </div>
            </h3>
            <span className="text-muted-foreground flex flex-row items-end gap-4 text-right text-xs @md:flex-col @md:gap-1">
              <Badge variant="secondary" className="w-max">
                Compose Message
              </Badge>
              <div>{new Date().toLocaleString()}</div>
              <div>Now</div>
            </span>
          </div>
          <div className="p-4">
            <ComposeNew messageId={Number(message)} />
          </div>
        </div>
      </div>
    </div>
  );
}
