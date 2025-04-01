import { api } from "@/server/api";
import OnboardingPageClient from "./page.client";

export default async function OnboardingPage() {
  const { data: schools } = await (await api({})).catalyst.schools.list();
  const { data: settings } = await (await api({})).catalyst.settings.list();

  settings["canvas_token"] = undefined as unknown as string;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Basic Information</h1>
      <OnboardingPageClient settings={settings} schools={schools} />
    </div>
  );
}
