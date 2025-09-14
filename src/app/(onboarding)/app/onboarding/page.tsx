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
      <h2 className="h4">Let{"'"}s get to know who you are!</h2>
      <p className="text-foreground/70 text-sm">
        Your email address remains completely private and is only used for
        essential account functions like password resets and important service
        updates.
        <br />
        <br />
        We collect school information to seamlessly integrate with Canvas and
        provide you with personalized schedule data. Don{"'"}t see your school
        listed? No problem—you can add it yourself, or reach out to our support
        team for assistance.
        <br />
        <br />
        When connecting with friends, only your first name will be visible to
        maintain your privacy. Your last name stays confidential and is
        exclusively used for support communications when you contact us
        directly.
        <br />
        <br />
        Please note that email addresses cannot be modified as they are securely
        synced with your Google account for your protection.
        <br />
      </p>
      <OnboardingPageClient settings={settings} schools={schools} />
    </div>
  );
}
