import { api } from "@/server/api";
import OnboardingCanvasPageClient from "./page.client";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding / Canvas Information",
  description: "Provide information about your Canvas account",
};

export default async function OnboardingCanvasPage() {
  const { data: settings } = await (
    await api({})
  ).catalyst.account.settings.list();
  const { data: school } = await (
    await api({})
  ).catalyst.schools.get({
    id: settings.school_id,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col">
        <div
          className="bg-border my-4 h-1 w-full overflow-hidden rounded-full"
          key="progress-bar"
        >
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: "66%" }}
          />
        </div>
        <div className="text-muted-foreground -mt-2 flex justify-between rounded-full text-xs">
          <span>Canvas Information</span>
          <span>Step 2 / 3</span>
        </div>
      </div>
      <OnboardingCanvasPageClient
        canvasUrl={school?.canvasURL ?? ""}
        tokenIsSaved={!!settings.canvas_token}
      />
    </div>
  );
}
