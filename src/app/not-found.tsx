import { Button } from "@/components/ui/button";
import { Ban, Home } from "lucide-react";

export default function Error() {
  return (
    <div className="flex max-h-full flex-col">
      <div className="mt-16 flex flex-col items-start justify-center gap-2 px-32 py-16">
        <Ban className="size-16" />
        <h1 className="h1">Hmm, Page Not Found</h1>
        <p className="text-muted-foreground">This page could not be found.</p>
        <div className="mt-4 flex items-center gap-4">
          <Button variant="secondary" href="/home">
            <Home /> Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
