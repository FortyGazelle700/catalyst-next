import { api } from "@/server/api";
import OnboardingPageClient from "./page.client";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding / General Information",
  description: "Provide information about yourself and your school",
};

export default async function OnboardingPage() {
  const { data: schools } = await (await api({})).catalyst.schools.list();
  const { data: settings } = await (await api({})).catalyst.settings.list();

  settings.canvas_token = undefined as unknown as string;
  settings.email =
    (await (await api({})).catalyst.getCtx()).user.get?.email ?? "";
  settings.school_id =
    (await (await api({})).catalyst.getCtx()).user.settings?.school_id ?? "";
  if (!schools.find((s) => s.id == settings.school_id)) {
    settings.school_id = "";
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col w-full">
        <div className="w-full my-4 bg-border rounded-full h-1 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 vt-name-[nav-slider]"
            style={{ width: "33%" }}
          />
        </div>
        <div className="flex justify-between text-muted-foreground text-xs -mt-2 rounded-full">
          <span>General Information</span>
          <span>Step 1 / 3</span>
        </div>
      </div>
      <OnboardingPageClient settings={settings} schools={schools} />
    </div>
  );
}
