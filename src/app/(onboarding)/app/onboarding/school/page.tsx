import { api } from "@/server/api";
import SchoolPageClient from "./page.client";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding / Create School",
  description: "Provide information about your school",
};

export default async function SchoolPage() {
  const { data: school } = await (await api({})).catalyst.schools.get({});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col w-full">
        <div className="w-full my-4 bg-border rounded-full h-1 overflow-hidden">
          <div
            className="bg-primary/50 h-full rounded-full transition-all duration-500 vt-name-[nav-slider]"
            style={{ width: "33%" }}
          />
        </div>
        <div className="flex justify-between text-muted-foreground text-xs -mt-2 rounded-full">
          <span>General Information</span>
          <span>Step 1 / 3</span>
        </div>
      </div>
      <SchoolPageClient school={school} />
    </div>
  );
}
