import { api } from "@/server/api";
import OnboardingCanvasPageClient from "./page.client";

export default async function OnboardingCanvasPage() {
  const { data: settings } = await (await api({})).catalyst.settings.list();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Canvas Information</h1>
      <OnboardingCanvasPageClient tokenIsSaved={!!settings["canvas_token"]} />
    </div>
  );
}
