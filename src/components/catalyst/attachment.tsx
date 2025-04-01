"use client";

import { Document, Page, pdfjs } from "react-pdf";
import Image from "next/image";
import { type RefObject, useEffect, useRef, useState } from "react";
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
    <div className="flex h-16 min-w-96 max-w-96 items-center gap-4 overflow-hidden rounded-xl border px-3">
      {(() => {
        if (attachment.type.startsWith("image/")) {
          return (
            <Image
              src={URL.createObjectURL(attachment)}
              width={32}
              height={32}
              alt={""}
              className="grid size-8 flex-shrink-0 place-items-center rounded-sm outline-1 outline-offset-2 outline-border"
            />
          );
        } else if (attachment.type.startsWith("audio/")) {
          return (
            <div className="grid size-8 flex-shrink-0 place-items-center rounded outline-1 outline-offset-2 outline-border">
              <Music className="size-8" />
            </div>
          );
        } else if (attachment.type.startsWith("video/")) {
          return (
            <div className="grid size-8 flex-shrink-0 place-items-center rounded outline-1 outline-offset-2 outline-border">
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
            <div className="grid size-8 flex-shrink-0 place-items-center rounded outline-1 outline-offset-2 outline-border">
              <FileText className="size-8" />
            </div>
          );
        } else if (attachment.type == "application/zip") {
          return (
            <div className="grid size-8 flex-shrink-0 place-items-center rounded outline-1 outline-offset-2 outline-border">
              <FolderArchive className="size-8" />
            </div>
          );
        } else if (
          attachment.type.startsWith("application/") ||
          attachment.name.endsWith(".dmg")
        ) {
          return (
            <div className="grid size-8 flex-shrink-0 place-items-center rounded outline-1 outline-offset-2 outline-border">
              <AppWindowMac className="size-8" />
            </div>
          );
        } else {
          return (
            <div className="grid size-8 flex-shrink-0 place-items-center rounded-sm bg-secondary outline-1 outline-offset-2 outline-border"></div>
          );
        }
      })()}
      <div className="w-[calc(100%-2rem)] overflow-hidden">
        <div className="truncate">{attachment.name}</div>
        <div className="flex gap-2 overflow-hidden text-xs text-muted-foreground">
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
        className="h-auto w-full rounded p-"
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
      <div className="flex items-center justify-start gap-2 rounded bg-destructive p-4 text-destructive-foreground">
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
      <div className="flex items-center justify-start gap-2 rounded bg-destructive p-4 text-destructive-foreground">
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
    <AudioVideoControls audio={audio} className={cn("w-full p-4", className)} />
  );
}

function AudioVideoControls({
  audio,
  isVideo,
  videoParent,
  className,
}: {
  audio: RefObject<HTMLAudioElement | HTMLVideoElement | null>;
  className?: string;
  isVideo?: boolean;
  videoParent?: RefObject<HTMLDivElement | null>;
}) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    isPlaying ? (audio.current?.play() as void) : audio.current?.pause();
  }, [audio, isPlaying]);

  useEffect(() => {
    if (audio.current) audio.current.muted = isMuted;
  }, [audio, isMuted]);

  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [audio, volume]);

  useEffect(() => {
    if (audio.current?.paused) audio.current.currentTime = currentTime;
  }, [audio, currentTime]);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [audio, speed]);

  useEffect(() => {
    const currAudio = audio.current;
    const onKeyPress = (evt: KeyboardEvent) => {
      (async () => {
        if (evt.code == "Space") {
          evt.preventDefault();
          setIsPlaying((isPlaying) => !isPlaying);
        }
        if (evt.code == "KeyF") {
          evt.preventDefault();
          if (document.fullscreenElement) await document.exitFullscreen();
          else if (isVideo) await videoParent?.current?.requestFullscreen();
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
          setCurrentTime(Math.max((currAudio?.currentTime ?? 5) - 5, 0));
        }
        if (evt.code == "ArrowRight") {
          evt.preventDefault();
          setCurrentTime(Math.min((currAudio?.currentTime ?? 0) + 5, duration));
        }
      })().catch(console.error);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(currAudio?.currentTime ?? 0);
    const onDurationChange = () => setDuration(currAudio?.duration ?? 0);
    const onEnded = () => setIsPlaying(false);

    document.body.addEventListener("keydown", onKeyPress);
    currAudio?.addEventListener("play", onPlay);
    currAudio?.addEventListener("pause", onPause);
    currAudio?.addEventListener("timeupdate", onTimeUpdate);
    currAudio?.addEventListener("durationchange", onDurationChange);
    currAudio?.addEventListener("ended", onEnded);
    return () => {
      document.body.removeEventListener("keydown", onKeyPress);
      currAudio?.removeEventListener("play", onPlay);
      currAudio?.removeEventListener("pause", onPause);
      currAudio?.removeEventListener("timeupdate", onTimeUpdate);
      currAudio?.removeEventListener("durationchange", onDurationChange);
      currAudio?.removeEventListener("ended", onEnded);
    };
  }, [duration, audio, isVideo, videoParent]);

  return (
    <div
      className={cn("flex items-center gap-4 rounded-xl border p-2", className)}
    >
      <div className="flex flex-1 items-center gap-2">
        <div className="w-10">
          <Button
            size="icon"
            className="py-4"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause />
            ) : audio.current?.ended ? (
              <RotateCcw />
            ) : (
              <Play />
            )}
          </Button>
        </div>
        <div className="flex w-full flex-1 flex-col gap-1">
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
            <div className="flex items-center gap-2">
              <span>
                {formatDuration(
                  Temporal.Duration.from({
                    milliseconds: 0,
                  }),
                  {
                    style: "digital",
                    minUnit: "second",
                  }
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
                  }
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
                  }
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
                  }
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-[15ch] items-center gap-2">
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
            isMuted ? "opacity-50" : null
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
      <div className="flex w-[15ch] items-center gap-2">
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
        <Button
          variant="outline"
          size="icon"
          href={audio.current?.src ?? ""}
          download
        >
          <Download />
        </Button>
        {isVideo && (
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              document.fullscreenElement
                ? document.exitFullscreen()
                : videoParent?.current?.requestFullscreen()
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

export function VideoPreview({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const videoParent = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);

  return (
    <div
      className={cn("flex flex-col gap-2 bg-background p-4", className)}
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
      <AudioVideoControls audio={video} isVideo videoParent={videoParent} />
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
        "flex flex-col gap-2 overflow-auto rounded-md bg-background p-4",
        className
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
            Number(el.target.getAttribute("data-page-number") ?? 0) - 1
          );
        }
      });
    })
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
          numPages - 1
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
      className="block h-full w-full overflow-auto bg-background p-2"
      ref={pdfContainer}
    >
      <Document
        file={src}
        onLoadSuccess={onLoad}
        onLoadError={onError}
        className={cn(
          "mx-auto flex w-[clamp(50ch,100%,100ch)] flex-col !items-stretch !gap-4 text-black [&>div>*]:!h-auto [&>div>*]:!w-full [&>div]:!min-w-0 [&>div]:flex-shrink-0 [&>div]:overflow-hidden [&>div]:rounded-xl [&>div]:border",
          (isLoading || isError) && "hidden"
        )}
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
          <Page pageNumber={page} key={page} />
        ))}
      </Document>
      {!isLoading && !isError && (
        <div className="fixed bottom-4 right-8 z-10 flex items-center gap-2 rounded-xl border bg-background p-2">
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
                  numPages - 1
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
        <div className="flex items-center justify-center gap-2 rounded bg-destructive p-4 text-destructive-foreground">
          <FileWarning />
          <p>Unable to load PDF. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
