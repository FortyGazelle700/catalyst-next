"use client";

import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import { type RefObject, useRef } from "react";
import type { ILottie } from "@lottielab/lottie-player/react";
import { cn } from "@/lib/utils";

const Lottie = dynamic(() => import("@lottielab/lottie-player/react"), {
  ssr: false,
});

const AudioVideoControls = dynamic(
  () => import("./attachment").then((mod) => mod.AudioVideoControls),
  {
    ssr: false,
  }
);

export function AnimationPlayer({
  src,
  autoplay = true,
  loop = true,
  className = "",
}: {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
}) {
  const lottie = useRef(undefined) as unknown as RefObject<ILottie>;
  const lottieContainer = useRef(undefined) as unknown as
    | RefObject<HTMLDivElement>
    | undefined;

  let removed = 0;
  const MAX_REMOVE = 1000;

  const toRemove = setInterval(() => {
    const el = lottieContainer?.current?.querySelector(
      'svg > g > g:has(g > g[opacity="0.8"])'
    );
    el?.remove();

    removed++;
    if (removed >= MAX_REMOVE) {
      clearInterval(toRemove);
    }
  }, 1);

  return (
    <div
      className={cn(
        "overflow-hidden w-full aspect-video bg-black/10 relative",
        className
      )}
      ref={lottieContainer}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <Loader className="animate-spin" />
        <span>Loading animation...</span>
      </div>
      <div className="render-white-content z-0 h-full">
        <Lottie
          ref={lottie}
          src={src}
          autoplay={autoplay}
          loop={loop}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <AudioVideoControls
        src={lottie}
        srcParent={lottieContainer}
        hasAudio={false}
        hasDownload={false}
        type="animation"
        className="z-10 absolute inset-4 top-auto bg-background mx-auto"
      />
    </div>
  );
}
