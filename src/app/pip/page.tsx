import { AppLayoutProviders } from "@/app/app/layout.providers";
import { cookies } from "next/headers";
import { api } from "@/server/api";
import { Render } from "./page.client";

export default async function PipWindow({
  searchParams,
}: {
  searchParams: Promise<{ window: string }>;
}) {
  const { data: isPro } = await (await api({})).catalyst.account.isPro();
  const cks = await cookies();

  return (
    <div className="bg-background h-full w-full">
      <AppLayoutProviders
        isPro={isPro}
        colorTheme={cks.get("color-theme")?.value ?? "default"}
        courses={[]}
      >
        <Render id={(await searchParams).window} />
      </AppLayoutProviders>
    </div>
  );
}
