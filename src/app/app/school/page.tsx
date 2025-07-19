import { Construction } from "lucide-react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function InboxPage() {
  return (
    <div className="flex flex-col items-start justify-center gap-2 px-32 py-16">
      <h1 className="h1 flex items-center gap-2"><Construction className="size-8" /> Under Development</h1>
      <p className="text-muted-foreground">
        This feature, is currently a planned feature, that might already be in the works! Check back again later to see updates.
      </p>
    </div>
  );
}
