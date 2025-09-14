"use client";

import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
} from "react";
import type { ILottie } from "@lottielab/lottie-player/react";
import { cn } from "@/lib/utils";

const Lottie = dynamic(() => import("@lottielab/lottie-player/react"), {
  ssr: false,
});

const AudioVideoControls = dynamic(
  () => import("./attachment").then((mod) => mod.AudioVideoControls),
  {
    ssr: false,
  },
);

export function AnimationPlayer({
  src,
  autoplay = false,
  loop = true,
  className = "",
  setLottie = undefined,
  speed = 1,
}: {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  time?: number;
  onTimeUpdate?: Dispatch<SetStateAction<number>>;
  setLottie?: Dispatch<SetStateAction<ILottie | undefined>>;
  speed?: number;
}) {
  const lottie = useRef(undefined) as unknown as RefObject<ILottie>;
  const lottieContainer = useRef(undefined) as unknown as
    | RefObject<HTMLDivElement>
    | undefined;

  let removed = 0;
  const MAX_REMOVE = 1000;

  useEffect(() => {
    setTimeout(() => {
      setLottie?.(lottie.current);
    }, 1000);
  }, [lottie, setLottie]);

  const toRemove = setInterval(() => {
    const el = lottieContainer?.current?.querySelector(
      'svg > g > g:has(g > g[opacity="0.8"])',
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
        "relative aspect-video w-full overflow-hidden bg-black/10",
        className,
      )}
      ref={lottieContainer}
    >
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-2">
        <Loader className="animate-spin" />
        <span>Loading animation...</span>
      </div>
      <div className="render-white-content z-0 h-full">
        <Lottie
          ref={lottie}
          src={src}
          autoplay={autoplay}
          loop={loop}
          speed={speed}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <AudioVideoControls
        src={lottie}
        srcParent={lottieContainer}
        hasAudio={false}
        hasDownload={false}
        type="animation"
        className="bg-background absolute inset-4 top-auto z-10 mx-auto"
      />
    </div>
  );
}
