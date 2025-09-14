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
      <h2 className="h3">How we use this data</h2>
      <p className="text-foreground/70 text-sm">
        Connecting your Canvas account lets Catalyst access your courses and
        assignments, and manage submissions processed through our platform. We
        never take actions without your explicit consent. Your access token is
        encrypted, stored securely, and only accessed when you make requests
        that require it.
        <br />
        <br />
        Feel free to slow down the animation, pause it, or rewatch any steps as
        needed. Click the arrow button to expand the tutorial steps.
      </p>
      <h2 className="h3">Canvas Information</h2>
      <OnboardingCanvasPageClient
        canvasUrl={school?.canvasURL ?? ""}
        tokenIsSaved={!!settings.canvas_token}
      />
    </div>
  );
}
