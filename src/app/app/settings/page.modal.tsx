"use client";

import dynamic from "next/dynamic";

const SettingsClientRenderer = dynamic(() => import("./page.client"), {
  ssr: false,
});

export default SettingsClientRenderer;
