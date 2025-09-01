"use client";

import dynamic from "next/dynamic";

export const Map = dynamic(
  async () => (await import("@/components/catalyst/map")).Map,
  {
    ssr: false,
  },
);
