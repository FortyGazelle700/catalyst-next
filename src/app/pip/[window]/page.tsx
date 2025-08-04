"use client";

import { use } from "react";
import { pipManager } from "../../app/manager.pip";
import { AppLayoutProviders } from "@/app/app/layout.providers";

export default function PipWindow({
  params,
}: {
  params: Promise<{ window: string }>;
}) {
  const param = use(params);

  return (
    <div className="bg-background h-full w-full">
      <AppLayoutProviders courses={[]}>
        <Render id={param.window} />
      </AppLayoutProviders>
    </div>
  );
}

function Render({ id }: { id: string }) {
  const elem = pipManager[id]?.Render();
  if (!elem) {
    return <div>Invalid PIP</div>;
  }
  return elem;
}
