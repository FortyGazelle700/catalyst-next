import { api } from "@/server/api";
import OnboardingCanvasPageClient from "./page.client";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding / Canvas Information",
  description: "Provide information about your Canvas account",
};

export default async function OnboardingCanvasPage() {
  const { data: settings } = await (await api({})).catalyst.settings.list();
  const { data: school } = await (
    await api({})
  ).catalyst.schools.get({
    id: settings.school_id,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col w-full">
        <div
          className="w-full my-4 bg-border rounded-full h-1 overflow-hidden"
          key="progress-bar"
        >
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: "66%" }}
          />
        </div>
        <div className="flex justify-between text-muted-foreground text-xs -mt-2 rounded-full">
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
