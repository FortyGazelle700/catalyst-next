import PeriodsPageClient from "./page.client";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding / School Periods",
  description: "Provide information about your school periods",
};

export default function PeriodsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col">
        <div className="bg-border my-4 h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary/50 vt-name-[nav-slider] h-full rounded-full transition-all duration-500"
            style={{ width: "33%" }}
          />
        </div>
        <div className="text-muted-foreground -mt-2 flex justify-between rounded-full text-xs">
          <span>General Information</span>
          <span>Step 1 / 3</span>
        </div>
      </div>
      <PeriodsPageClient />
    </div>
  );
}
