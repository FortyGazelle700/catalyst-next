import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import Pages from "./pages.mdx";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies",
};

export default function PoliciesList() {
  return (
    <>
      <div className="grid flex-1 place-items-center">
        <div className="flex w-[min(60ch,100vw)] flex-col gap-2 rounded-lg border p-8">
          <div className="flex items-center justify-start gap-2">
            <Button variant="outline" href="/home">
              <ArrowLeft /> Exit
            </Button>
          </div>
          <Pages />
        </div>
      </div>
    </>
  );
}
