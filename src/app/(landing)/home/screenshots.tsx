"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
} from "@/components/ui/carousel";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import AutoplayPlugin from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function ScreenshotsCarousel() {
  return (
    <Carousel
      opts={{
        loop: true,
        align: "center",
      }}
      plugins={[WheelGesturesPlugin(), AutoplayPlugin()]}
      className="w-full max-w-96 mx-auto"
    >
      <CarouselPictures />
    </Carousel>
  );
}

function CarouselPictures() {
  const { api } = useCarousel();
  const [page, setPage] = useState(0);
  const pages = useRef([
    {
      title: "Dashboard",
      description:
        "A dashboard to easily manage courses, assignments, and grades.",
      image: "/1920x1080.svg",
    },
    {
      title: "Courses",
      description: "Easily view and find your course",
      image: "/1920x1080.svg",
    },
    {
      title: "Grades",
      description: "Easily view and preview grades.",
      image: "/1920x1080.svg",
    },
    {
      title: "Messaging",
      description: "Easily communicate with your teachers and classmates.",
      image: "/1920x1080.svg",
    },
    {
      title: "Social",
      description:
        "A social system by Catalyst that allows to communicate with friends and create groups easily.",
      image: "/1920x1080.svg",
    },
  ]);

  useEffect(() => {
    const onSelect = () => {
      setPage(api?.selectedScrollSnap() ?? 0);
    };

    api
      ?.on("select", onSelect)
      ?.on("init", onSelect)
      ?.on("reInit", onSelect)
      .on("slidesChanged", onSelect);
  }, [api]);

  return (
    <>
      <div className="relative w-auto">
        <CarouselContent className="w-full rounded-lg">
          {pages.current.map((page, idx) => (
            <CarouselItem key={idx} className="h-full gap-0">
              <div className="flex w-full flex-col">
                <Image
                  src={page.image}
                  width={400}
                  height={400}
                  alt={page.title}
                  className="aspect-video w-full rounded-lg border object-cover bg-black"
                />
                <div>
                  <p className="text-sm font-bold">{page.title}</p>
                  <p className="text-xs">{page.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute top-0 bottom-0 -left-4 w-4 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute top-0 bottom-0 -right-4 w-4 bg-gradient-to-l from-background to-transparent" />
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex gap-2">
          <CarouselPrevious className="size-auto rounded-full p-2" />
          <CarouselNext className="size-auto rounded-full p-2" />
        </div>
        <div className="flex gap-2">
          {pages.current.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={cn(
                "h-2 w-4 rounded-full bg-secondary transition-all",
                {
                  "w-8 bg-primary": idx == page,
                }
              )}
            >
              <span className="sr-only">{`Go to page ${idx + 1}`}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
