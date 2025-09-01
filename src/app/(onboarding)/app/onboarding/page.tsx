import { api } from "@/server/api";
import OnboardingPageClient from "./page.client";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding / General Information",
  description: "Provide information about yourself and your school",
};

export default async function OnboardingPage() {
  const { data: schools } = await (await api({})).catalyst.schools.list();
  const { data: settings } = await (
    await api({})
  ).catalyst.account.settings.list();

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
      <div className="flex w-full flex-col">
        <div className="bg-border my-4 h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary vt-name-[nav-slider] h-full rounded-full transition-all duration-500"
            style={{ width: "33%" }}
          />
        </div>
        <div className="text-muted-foreground -mt-2 flex justify-between rounded-full text-xs">
          <span>General Information</span>
          <span>Step 1 / 3</span>
        </div>
      </div>
      <OnboardingPageClient settings={settings} schools={schools} />
    </div>
  );
}
