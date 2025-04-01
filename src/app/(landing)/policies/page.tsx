import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import Pages from "./pages.mdx";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies",
};

export default function PoliciesList() {
  return (
    <>
      <div className="flex-1 grid place-items-center">
        <div className="border rounded-lg p-8 w-[min(60ch,100vw)] gap-2 flex flex-col">
          <div className="flex gap-2 items-center justify-start">
            <Button variant="outline" href="/">
              <ArrowLeft /> Exit
            </Button>
          </div>
          <Pages />
        </div>
      </div>
    </>
  );
}
