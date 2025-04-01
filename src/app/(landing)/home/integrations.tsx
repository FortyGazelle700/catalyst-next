"use client";

import { cn } from "@/lib/utils";
import {
  FlaskConical,
  Code,
  Bell,
  MoreVertical,
  AppWindowMac,
} from "lucide-react";
import { forwardRef, type RefObject, useRef } from "react";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const Circle = forwardRef<
  HTMLDivElement,
  { tooltip: string; className?: string; children?: React.ReactNode }
>(({ className, children, tooltip }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          ref={ref}
          className={cn(
            "relative z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-background p-3",
            className
          )}
        >
          {children}
          <div className="sr-only">{tooltip}</div>
        </div>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
});

Circle.displayName = "Circle";

export function Integrations({ className }: { className?: string }) {
  const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;
  const canvasRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const driveRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const outlookRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const geminiRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const catalystInpRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;
  const catalystRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const notificationRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;
  const userRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const apiRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center gap-4">
          <Circle ref={canvasRef} tooltip="Canvas">
            <CanvasLogo />
          </Circle>
          <Circle ref={driveRef} tooltip="Google Drive">
            <GoogleDriveLogo />
          </Circle>
          <Circle ref={outlookRef} tooltip="Outlook">
            <OutlookIcon />
          </Circle>
          <Circle ref={geminiRef} tooltip="Gemini AI">
            <GeminiLogo />
          </Circle>
          <Circle ref={catalystInpRef} tooltip="Extra Information">
            <MoreVertical />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle
            ref={catalystRef}
            className="size-16 text-2xl"
            tooltip="Catalyst"
          >
            <FlaskConical />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-10">
          <Circle ref={notificationRef} tooltip="Notifications">
            <Bell />
          </Circle>
          <Circle ref={userRef} tooltip="Application">
            <AppWindowMac />
          </Circle>
          <Circle ref={apiRef} tooltip="API">
            <Code />
          </Circle>
        </div>
      </div>
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={canvasRef}
        toRef={catalystRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={driveRef}
        toRef={catalystRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={outlookRef}
        toRef={catalystRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={geminiRef}
        toRef={catalystRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={catalystInpRef}
        toRef={catalystRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={catalystRef}
        toRef={notificationRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={catalystRef}
        toRef={userRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={catalystRef}
        toRef={apiRef}
      />
    </div>
  );
}

function CanvasLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64.000000pt"
      height="64.000000pt"
      viewBox="0 0 64.000000 64.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
        fill="hsl(358.46, 80.25%, 52.35%)"
        stroke="none"
      >
        <path
          d="M248 633 c-25 -6 -22 -30 7 -58 35 -36 97 -35 130 1 31 33 32 50 3
            58 -26 6 -114 6 -140 -1z"
        />
        <path
          d="M118 570 c-21 -17 -47 -45 -59 -62 -21 -29 -21 -32 -5 -44 43 -31
            124 13 130 72 4 29 -8 64 -22 64 -4 0 -24 -14 -44 -30z"
        />
        <path
          d="M460 574 c-22 -56 22 -116 85 -116 55 0 63 15 31 56 -26 34 -86 86
            -100 86 -3 0 -11 -12 -16 -26z"
        />
        <path
          d="M297 513 c-13 -12 -7 -41 10 -47 21 -8 48 17 40 38 -6 16 -38 22 -50
          9z"
        />
        <path
          d="M177 463 c-13 -12 -7 -41 10 -47 21 -9 46 16 37 37 -6 17 -35 23 -47
            10z"
        />
        <path d="M414 455 c-4 -9 0 -23 8 -31 20 -20 50 -7 46 20 -4 26 -45 35 -54 11z" />
        <path
          d="M6 388 c-7 -29 -7 -107 0 -135 8 -30 25 -29 58 2 36 33 37 95 1 130
            -30 31 -51 32 -59 3z"
        />
        <path
          d="M575 385 c-19 -18 -25 -35 -25 -65 0 -30 6 -47 25 -65 45 -46 65 -27
            65 65 0 92 -20 111 -65 65z"
        />
        <path d="M124 335 c-8 -21 2 -45 19 -45 21 0 38 25 31 44 -8 20 -43 21 -50 1z" />
        <path
          d="M470 335 c-11 -13 -11 -19 3 -32 21 -21 49 -9 45 19 -4 28 -30 35
            -48 13z"
        />
        <path
          d="M174 215 c-9 -23 3 -45 25 -45 23 0 35 28 20 46 -15 18 -38 18 -45
            -1z"
        />
        <path
          d="M420 216 c-18 -22 -5 -48 22 -44 17 2 23 10 23 28 0 29 -26 38 -45
            16z"
        />
        <path
          d="M63 180 c-13 -5 -23 -14 -23 -20 0 -17 109 -122 122 -118 17 6 28 56
            19 81 -19 48 -75 75 -118 57z"
        />
        <path
          d="M504 176 c-39 -17 -60 -69 -45 -110 6 -14 15 -26 21 -26 15 0 120
            105 120 120 0 9 -41 31 -58 30 -4 -1 -21 -7 -38 -14z"
        />
        <path
          d="M300 165 c-7 -8 -10 -22 -6 -30 7 -19 45 -19 52 0 6 15 -11 45 -26
            45 -4 0 -13 -7 -20 -15z"
        />
        <path
          d="M255 65 c-46 -45 -27 -65 65 -65 92 0 111 20 65 65 -34 35 -96 35
            -130 0z"
        />
      </g>
    </svg>
  );
}

function GoogleDriveLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="48px"
      height="48px"
    >
      <path
        fill="#1e88e5"
        d="M38.59,39c-0.535,0.93-0.298,1.68-1.195,2.197C36.498,41.715,35.465,42,34.39,42H13.61 c-1.074,0-2.106-0.285-3.004-0.802C9.708,40.681,9.945,39.93,9.41,39l7.67-9h13.84L38.59,39z"
      />
      <path
        fill="#fbc02d"
        d="M27.463,6.999c1.073-0.002,2.104-0.716,3.001-0.198c0.897,0.519,1.66,1.27,2.197,2.201l10.39,17.996 c0.537,0.93,0.807,1.967,0.808,3.002c0.001,1.037-1.267,2.073-1.806,3.001l-11.127-3.005l-6.924-11.993L27.463,6.999z"
      />
      <path
        fill="#e53935"
        d="M43.86,30c0,1.04-0.27,2.07-0.81,3l-3.67,6.35c-0.53,0.78-1.21,1.4-1.99,1.85L30.92,30H43.86z"
      />
      <path
        fill="#4caf50"
        d="M5.947,33.001c-0.538-0.928-1.806-1.964-1.806-3c0.001-1.036,0.27-2.073,0.808-3.004l10.39-17.996 c0.537-0.93,1.3-1.682,2.196-2.2c0.897-0.519,1.929,0.195,3.002,0.197l3.459,11.009l-6.922,11.989L5.947,33.001z"
      />
      <path
        fill="#1565c0"
        d="M17.08,30l-6.47,11.2c-0.78-0.45-1.46-1.07-1.99-1.85L4.95,33c-0.54-0.93-0.81-1.96-0.81-3H17.08z"
      />
      <path
        fill="#2e7d32"
        d="M30.46,6.8L24,18L17.53,6.8c0.78-0.45,1.66-0.73,2.6-0.79L27.46,6C28.54,6,29.57,6.28,30.46,6.8z"
      />
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="48px"
      height="48px"
    >
      <path
        fill="#03A9F4"
        d="M21,31c0,1.104,0.896,2,2,2h17c1.104,0,2-0.896,2-2V16c0-1.104-0.896-2-2-2H23c-1.104,0-2,0.896-2,2V31z"
      />
      <path
        fill="#B3E5FC"
        d="M42,16.975V16c0-0.428-0.137-0.823-0.367-1.148l-11.264,6.932l-7.542-4.656L22.125,19l8.459,5L42,16.975z"
      />
      <path fill="#0277BD" d="M27 41.46L6 37.46 6 9.46 27 5.46z" />
      <path
        fill="#FFF"
        d="M21.216,18.311c-1.098-1.275-2.546-1.913-4.328-1.913c-1.892,0-3.408,0.669-4.554,2.003c-1.144,1.337-1.719,3.088-1.719,5.246c0,2.045,0.564,3.714,1.69,4.986c1.126,1.273,2.592,1.91,4.378,1.91c1.84,0,3.331-0.652,4.474-1.975c1.143-1.313,1.712-3.043,1.712-5.199C22.869,21.281,22.318,19.595,21.216,18.311z M19.049,26.735c-0.568,0.769-1.339,1.152-2.313,1.152c-0.939,0-1.699-0.394-2.285-1.187c-0.581-0.785-0.87-1.861-0.87-3.211c0-1.336,0.289-2.414,0.87-3.225c0.586-0.81,1.368-1.211,2.355-1.211c0.962,0,1.718,0.393,2.267,1.178c0.555,0.795,0.833,1.895,0.833,3.31C19.907,24.906,19.618,25.968,19.049,26.735z"
      />
    </svg>
  );
}

function GeminiLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
    >
      <path
        d="M14 28C14 26.0633 13.6267 24.2433 12.88 22.54C12.1567 20.8367 11.165 19.355 9.905 18.095C8.645 16.835 7.16333 15.8433 5.46 15.12C3.75667 14.3733 1.93667 14 0 14C1.93667 14 3.75667 13.6383 5.46 12.915C7.16333 12.1683 8.645 11.165 9.905 9.905C11.165 8.645 12.1567 7.16333 12.88 5.46C13.6267 3.75667 14 1.93667 14 0C14 1.93667 14.3617 3.75667 15.085 5.46C15.8317 7.16333 16.835 8.645 18.095 9.905C19.355 11.165 20.8367 12.1683 22.54 12.915C24.2433 13.6383 26.0633 14 28 14C26.0633 14 24.2433 14.3733 22.54 15.12C20.8367 15.8433 19.355 16.835 18.095 18.095C16.835 19.355 15.8317 20.8367 15.085 22.54C14.3617 24.2433 14 26.0633 14 28Z"
        fill="url(#paint0_radial_16771_53212)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_16771_53212"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(2.77876 11.3795) rotate(18.6832) scale(29.8025 238.737)"
        >
          <stop offset="0.0671246" stopColor="#9168C0" />
          <stop offset="0.342551" stopColor="#5684D1" />
          <stop offset="0.672076" stopColor="#1BA1E3" />
        </radialGradient>
      </defs>
    </svg>
  );
}
