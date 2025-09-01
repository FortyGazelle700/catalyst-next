"use client";

import { Document, Page, pdfjs } from "react-pdf";
import Image from "next/image";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  AppWindowMac,
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  FileText,
  FileWarning,
  FolderArchive,
  Gauge,
  Maximize,
  Minimize,
  Music,
  Pause,
  Play,
  RotateCcw,
  Slash,
  Trash,
  Video,
  Volume2,
  VolumeX,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import prettyBytes from "pretty-bytes";
import { Temporal } from "@js-temporal/polyfill";
import { formatDuration } from "./format-duration";
import { type ILottie } from "@lottielab/lottie-player/react";

export function AttachmentPreview({
  attachment,
  isRemovable = false,
  onRemove = () => {
    /**/
  },
}: {
  attachment: File;
  isRemovable?: boolean;
  onRemove?: () => void;
}) {
  return (
    <div className="flex h-16 max-w-96 min-w-96 items-center gap-4 overflow-hidden rounded-xl border px-3">
      {(() => {
        if (attachment.type.startsWith("image/")) {
          return (
            <Image
              src={URL.createObjectURL(attachment)}
              width={32}
              height={32}
              alt={""}
              className="outline-border grid size-8 shrink-0 place-items-center rounded-sm outline-1 outline-offset-2"
            />
          );
        } else if (attachment.type.startsWith("audio/")) {
          return (
            <div className="outline-border grid size-8 shrink-0 place-items-center rounded outline-1 outline-offset-2">
              <Music className="size-8" />
            </div>
          );
        } else if (attachment.type.startsWith("video/")) {
          return (
            <div className="outline-border grid size-8 shrink-0 place-items-center rounded outline-1 outline-offset-2">
              <Video className="size-8" />
            </div>
          );
        } else if (
          attachment.type == "application/pdf" ||
          attachment.type ==
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          attachment.type ==
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
          attachment.type == "text/plain"
        ) {
          return (
            <div className="outline-border grid size-8 shrink-0 place-items-center rounded outline-1 outline-offset-2">
              <FileText className="size-8" />
            </div>
          );
        } else if (attachment.type == "application/zip") {
          return (
            <div className="outline-border grid size-8 shrink-0 place-items-center rounded outline-1 outline-offset-2">
              <FolderArchive className="size-8" />
            </div>
          );
        } else if (
          attachment.type.startsWith("application/") ||
          attachment.name.endsWith(".dmg")
        ) {
          return (
            <div className="outline-border grid size-8 shrink-0 place-items-center rounded outline-1 outline-offset-2">
              <AppWindowMac className="size-8" />
            </div>
          );
        } else {
          return (
            <div className="bg-secondary outline-border grid size-8 shrink-0 place-items-center rounded-sm outline-1 outline-offset-2"></div>
          );
        }
      })()}
      <div className="w-[calc(100%-2rem)] overflow-hidden">
        <div className="truncate">{attachment.name}</div>
        <div className="text-muted-foreground flex gap-2 overflow-hidden text-xs">
          <div className="w-max text-nowrap">
            {prettyBytes(attachment.size)}
          </div>
          <div className="truncate">{attachment.type}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          href={URL.createObjectURL(attachment)}
          download
        >
          <Download />
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="icon">
              <Eye />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="flex items-center justify-between">
              <DrawerTitle>{attachment.name}</DrawerTitle>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  href={URL.createObjectURL(attachment)}
                  download
                >
                  <Download />
                </Button>
                {isRemovable && (
                  <Button variant="destructive" size="icon" onClick={onRemove}>
                    <Trash />
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button variant="outline" size="icon">
                    <XIcon />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            {attachment && <FilePreview file={attachment} />}
            {!attachment && <>loading....</>}
          </DrawerContent>
        </Drawer>
        {isRemovable && (
          <Button variant="destructive" size="icon" onClick={onRemove}>
            <Trash />
          </Button>
        )}
      </div>
    </div>
  );
}

export function FilePreview({ file }: { file: File }) {
  if (file.type == "application/pdf") {
    return <PDF src={file} />;
  } else if (file.type.startsWith("image/")) {
    return (
      <Image
        src={URL.createObjectURL(file)}
        alt={"Preview Image"}
        width={10000}
        height={10000}
        className="p- h-auto w-full rounded"
      />
    );
  } else if (file.type.startsWith("audio/")) {
    return <AudioPreview src={URL.createObjectURL(file)} className="w-full" />;
  } else if (file.type.startsWith("video/")) {
    return <VideoPreview src={URL.createObjectURL(file)} />;
  } else if (file.type.startsWith("text/")) {
    return <TextPreview src={URL.createObjectURL(file)} className="w-full" />;
  } else if (
    file.type ==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type ==
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return (
      <div className="bg-destructive text-destructive-foreground flex items-center justify-start gap-2 rounded p-4">
        <FileWarning />
        <p>
          Word and Powerpoint Documents are unable to be viewed in the browser.
          If possible, please convert the file to a PDF or download the file to
          view it in your local application.
        </p>
      </div>
    );
  } else {
    return (
      <div className="bg-destructive text-destructive-foreground flex items-center justify-start gap-2 rounded p-4">
        <FileWarning />
        <p>
          Unsupported file type. Please download the file to view it in your
          local application.
        </p>
      </div>
    );
  }
}

function AudioPreview({ src, className }: { src: string; className?: string }) {
  const audio = useRef<HTMLAudioElement>(new Audio(src));

  return (
    <AudioVideoControls
      src={audio}
      hasAudio={true}
      type="audio"
      className={cn("w-full p-4", className)}
      hasDownload={true}
    />
  );
}

export function VideoPreview({
  src,
  className,
  hasAudio = true,
}: {
  src: string;
  className?: string;
  hasAudio?: boolean;
}) {
  const videoParent = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);

  return (
    <div
      className={cn("bg-background flex flex-col gap-2 p-4", className)}
      ref={videoParent}
    >
      <video
        src={src}
        className="w-full overflow-hidden rounded-md"
        ref={video}
        onClick={() =>
          video.current?.paused ? video.current?.play() : video.current?.pause()
        }
      />
      <AudioVideoControls
        src={video}
        hasAudio={hasAudio}
        type="video"
        srcParent={videoParent}
        hasDownload={true}
      />
    </div>
  );
}

export function AudioVideoControls({
  src,
  type,
  srcParent,
  className,
  hasAudio = true,
  hasDownload = true,
}:
  | {
      src: RefObject<HTMLAudioElement | null>;
      className?: string;
      type: "audio";
      srcParent?: RefObject<null>;
      hasAudio: true;
      hasDownload: boolean;
    }
  | {
      src: RefObject<HTMLVideoElement | null>;
      className?: string;
      type: "video";
      srcParent?: RefObject<HTMLDivElement | null>;
      hasAudio: boolean;
      hasDownload: boolean;
    }
  | {
      src: RefObject<ILottie | null>;
      className?: string;
      type: "animation";
      srcParent?: RefObject<HTMLDivElement | null>;
      hasAudio: false;
      hasDownload: false;
    }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [speed, setSpeed] = useState<number>(1);

  const hasLoaded = useRef(false);

  useEffect(() => {
    (async () => {
      await (isPlaying ? src.current?.play() : src.current?.pause());
    })().catch(console.error);
  }, [src, isPlaying]);

  useEffect(() => {
    if (src.current && "muted" in src.current) src.current.muted = isMuted;
  }, [src, isMuted]);

  useEffect(() => {
    if (src.current && "volume" in src.current) src.current.volume = volume;
  }, [src, volume]);

  useEffect(() => {
    if (src.current && "paused" in src.current && src.current.paused)
      src.current.currentTime = currentTime;
    if (src.current && "playing" in src.current && !src.current.playing)
      src.current.currentTime = currentTime;
  }, [src, currentTime]);

  useEffect(() => {
    if (src.current && "playbackRate" in src.current)
      src.current.playbackRate = speed;
    if (src.current && "speed" in src.current) src.current.speed = speed;
  }, [src, speed]);

  useEffect(() => {
    const currSrc = src.current;
    const onKeyPress = (evt: KeyboardEvent) => {
      (async () => {
        if (evt.code == "Space") {
          evt.preventDefault();
          setIsPlaying((isPlaying) => !isPlaying);
        }
        if (evt.code == "KeyF") {
          evt.preventDefault();
          if (document.fullscreenElement) await document.exitFullscreen();
          else if (type === "video")
            await srcParent?.current?.requestFullscreen();
        }
        if (evt.code == "KeyM") {
          evt.preventDefault();
          setIsMuted((isMuted) => !isMuted);
        }
        if (evt.code == "ArrowUp") {
          evt.preventDefault();
          setVolume((volume) => Math.min(volume + 0.05, 1));
        }
        if (evt.code == "ArrowDown") {
          evt.preventDefault();
          setVolume((volume) => Math.max(volume - 0.05, 0));
        }
        if (evt.code == "ArrowLeft") {
          evt.preventDefault();
          setCurrentTime(Math.max((currSrc?.currentTime ?? 5) - 5, 0));
        }
        if (evt.code == "ArrowRight") {
          evt.preventDefault();
          setCurrentTime(Math.min((currSrc?.currentTime ?? 0) + 5, duration));
        }
      })().catch(console.error);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(src.current?.currentTime ?? 0);
    const onDurationChange = () => setDuration(src.current?.duration ?? 0);
    const onEnded = () => setIsPlaying(false);

    document.body.addEventListener("keydown", onKeyPress);
    if (type != "animation") {
      if (!currSrc || !("addEventListener" in currSrc)) return;
      currSrc?.addEventListener("play", onPlay);
      currSrc?.addEventListener("pause", onPause);
      currSrc?.addEventListener("timeupdate", onTimeUpdate);
      currSrc?.addEventListener("durationchange", onDurationChange);
      currSrc?.addEventListener("ended", onEnded);
    } else {
      let loadIter = 0;
      const check = setInterval(() => {
        if (!src.current) {
          return;
        }
        loadIter++;
        if (loadIter < 10) return;
        hasLoaded.current = true;
        clearInterval(check);
        onPlay();
        onDurationChange();
        if (!src.current || !("on" in src.current)) return;
        src.current.on("time", onTimeUpdate);
      }, 100);
    }
    return () => {
      document.body.removeEventListener("keydown", onKeyPress);
      if (!currSrc || !("removeEventListener" in currSrc)) return;
      currSrc?.removeEventListener("play", onPlay);
      currSrc?.removeEventListener("pause", onPause);
      currSrc?.removeEventListener("timeupdate", onTimeUpdate);
      currSrc?.removeEventListener("durationchange", onDurationChange);
      currSrc?.removeEventListener("ended", onEnded);
    };
  }, [duration, src, type, srcParent]);

  const isFinished = useMemo(() => {
    if (src.current && "ended" in src.current) {
      return src.current.ended;
    } else {
      return src.current?.currentTime == duration;
    }
  }, [duration, src]);

  return (
    <div
      className={cn(
        "@container flex items-center gap-4 rounded-xl border p-2",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-2">
        <div className="w-10">
          <Button
            size="icon"
            className="py-4"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause /> : isFinished ? <RotateCcw /> : <Play />}
          </Button>
        </div>
        <div className="hidden w-full flex-1 flex-col gap-1 @sm:flex">
          <Slider
            defaultValue={[0]}
            value={[currentTime ?? 0]}
            max={duration}
            onValueChange={(value) => {
              setIsPlaying(false);
              setCurrentTime(value[0]!);
            }}
          />
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span>
                {formatDuration(
                  Temporal.Duration.from({
                    milliseconds: 0,
                  }),
                  {
                    style: "digital",
                    minUnit: "second",
                  },
                )}
              </span>
              <span>
                {formatDuration(
                  Temporal.Duration.from({
                    milliseconds: Math.floor(currentTime * 1000),
                  }),
                  {
                    style: "digital",
                    minUnit: "second",
                  },
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                {formatDuration(
                  Temporal.Duration.from({
                    milliseconds: Math.floor((duration - currentTime) * 1000),
                  }),
                  {
                    style: "digital",
                    minUnit: "second",
                  },
                )}
              </span>
              <span>
                {formatDuration(
                  Temporal.Duration.from({
                    milliseconds: Math.floor(duration * 1000),
                  }),
                  {
                    style: "digital",
                    minUnit: "second",
                  },
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      {hasAudio && (
        <div className="hidden w-[15ch] items-center gap-2 @md:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
          <div
            className={cn(
              "flex w-[calc(100%-3rem)] flex-col gap-1",
              isMuted ? "opacity-50" : null,
            )}
          >
            <Slider
              defaultValue={[0.8]}
              value={[volume]}
              step={0.05}
              max={1}
              onValueChange={(value) => {
                setIsMuted(false);
                setVolume(value[0]!);
              }}
            />
            <div className="flex justify-between gap-2 text-xs">
              <span className="w-[4ch]">0%</span>
              <span className="w-[4ch]">{Math.floor(volume * 100)}%</span>
              <span className="w-[4ch]">100%</span>
            </div>
          </div>
        </div>
      )}
      <div className="hidden w-[15ch] items-center gap-2 @md:flex">
        <Button variant="outline" size="icon" onClick={() => setSpeed(1)}>
          <Gauge />
        </Button>
        <div className="flex w-[calc(100%-3rem)] flex-col gap-1">
          <Slider
            defaultValue={[1]}
            value={[speed]}
            step={0.05}
            min={0.1}
            max={2}
            onValueChange={(value) => setSpeed(value[0]!)}
          />
          <div className="flex justify-between gap-2 text-xs">
            <span className="w-[4ch]">10%</span>
            <span className="w-[4ch]">{Math.floor(speed * 100)}%</span>
            <span className="w-[4ch]">200%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasDownload && (
          <Button
            variant="outline"
            size="icon"
            href={src.current && "src" in src.current ? src.current.src : ""}
            download
            className="hidden @md:flex"
          >
            <Download />
          </Button>
        )}
        {type != "audio" && (
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              document.fullscreenElement
                ? document.exitFullscreen()
                : srcParent?.current?.requestFullscreen()
            }
          >
            {(() =>
              document.fullscreenElement ? <Minimize /> : <Maximize />)()}
          </Button>
        )}
      </div>
    </div>
  );
}

export function TextPreview({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((text) => setText(text))
      .catch(console.error);
  }, [src]);

  return (
    <div
      className={cn(
        "bg-background flex flex-col gap-2 overflow-auto rounded-md p-4",
        className,
      )}
    >
      <pre>{text}</pre>
    </div>
  );
}

export function PDF({ src }: { src: File }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const pdfContainer = useRef<HTMLDivElement | null>(null);
  const pageInput = useRef<HTMLInputElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(
    new IntersectionObserver((els) => {
      els.forEach((el) => {
        if (el.isIntersecting) {
          setCurrentPage(
            Number(el.target.getAttribute("data-page-number") ?? 0) - 1,
          );
        }
      });
    }),
  );
  const [pages, setPages] = useState<HTMLDivElement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.js`;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const pages: HTMLDivElement[] = [];
      pdfContainer.current
        ?.querySelector("div")!
        .querySelectorAll("& > div")
        .forEach((page) => {
          pages.push(page as HTMLDivElement);
        });
      setPages(pages);
    }, 100);
  }, [isLoading, isError]);

  useEffect(() => {
    const onKeyPress = (evt: KeyboardEvent) => {
      if (document.activeElement == pageInput.current) return;
      if (evt.code == "ArrowUp" || evt.code == "ArrowLeft") {
        const newPage = Math.max(currentPage - 1, 0);
        setCurrentPage(newPage);
        pages[newPage]?.scrollIntoView({ behavior: "smooth" });
      }
      if (evt.code == "ArrowDown" || evt.code == "ArrowRight") {
        evt.preventDefault();
        const newPage = Math.min(currentPage + 1, numPages - 1);
        setCurrentPage(newPage);
        pages[newPage]?.scrollIntoView({ behavior: "smooth" });
      }
      if (!Number.isNaN(Number(evt.key))) {
        evt.preventDefault();
        const newPage = Math.min(
          Math.max(Number(evt.key) - 1, 0),
          numPages - 1,
        );
        setCurrentPage(newPage);
        pageInput.current?.focus();
        pages[newPage]?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, [currentPage, numPages, pages]);

  useEffect(() => {
    pages.forEach((page) => {
      observer.current?.observe(page);
    });
    // return () => {
    //   pages.forEach((page) => {
    //     observer.current?.unobserve(page);
    //   });
    // };
  }, [pages]);

  function onLoad({ numPages }: { numPages: number }) {
    setIsLoading(false);
    setNumPages(numPages);
  }

  function onError(error: Error) {
    setIsLoading(false);
    setIsError(true);
    console.error(error);
  }

  return (
    <div
      className="bg-background block h-full w-full overflow-auto p-2"
      ref={pdfContainer}
    >
      <Document
        file={src}
        onLoadSuccess={onLoad}
        onLoadError={onError}
        className={cn(
          "mx-auto flex w-[clamp(50ch,100%,100ch)] flex-col !items-stretch !gap-4 text-black [&>div]:!min-w-0 [&>div]:shrink-0 [&>div]:overflow-hidden [&>div]:rounded-xl [&>div]:border [&>div>*]:!h-auto [&>div>*]:!w-full",
          (isLoading || isError) && "hidden",
        )}
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
          <Page pageNumber={page} key={page} />
        ))}
      </Document>
      {!isLoading && !isError && (
        <div className="bg-background fixed right-8 bottom-4 z-10 flex items-center gap-2 rounded-xl border p-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 0);
              setCurrentPage(newPage);
              pages[newPage]?.scrollIntoView({ behavior: "smooth" });
            }}
            disabled={currentPage == 0}
          >
            <ArrowUp />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newPage = Math.min(currentPage + 1, numPages - 1);
              setCurrentPage(newPage);
              pages[newPage]?.scrollIntoView({ behavior: "smooth" });
            }}
            disabled={currentPage == numPages - 1}
          >
            <ArrowDown />
          </Button>
          <span className="flex items-center gap-2">
            <Input
              value={currentPage + 1}
              placeholder="0"
              type="number"
              className="hide-arrows w-[8ch]"
              ref={pageInput}
              onChange={() => {
                const newPage = Math.min(
                  Math.max(Number(pageInput.current?.value ?? 0) - 1, 0),
                  numPages - 1,
                );
                setCurrentPage(newPage);
                pages[newPage]?.scrollIntoView({ behavior: "smooth" });
              }}
            />
            <Slash />
            {numPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            href={URL.createObjectURL(src)}
            download
          >
            <Download />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              if (document.fullscreenElement) await document.exitFullscreen();
              else await pdfContainer.current?.requestFullscreen();
            }}
          >
            {document.fullscreenElement ? <Minimize /> : <Maximize />}
          </Button>
        </div>
      )}
      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="aspect-[8.5/11] w-full rounded-md" />
            ))}
        </div>
      )}
      {isError && (
        <div className="bg-destructive text-destructive-foreground flex items-center justify-center gap-2 rounded p-4">
          <FileWarning />
          <p>Unable to load PDF. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
