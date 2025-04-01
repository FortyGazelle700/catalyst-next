import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-1 grid place-items-center">
        <div className="border rounded-lg p-8 w-[min(120ch,100vw)] gap-2 flex flex-col">
          <div className="flex gap-2 items-center justify-start">
            <Button variant="outline" href="/policies">
              <ArrowLeft /> Policies
            </Button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
