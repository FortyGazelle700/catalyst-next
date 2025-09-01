import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="grid flex-1 place-items-center">
        <div className="flex w-[min(120ch,calc(100vw-8rem))] flex-col gap-2 rounded-lg border p-8">
          <div className="flex items-center justify-start gap-2">
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
