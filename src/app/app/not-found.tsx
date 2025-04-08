import { Button } from "@/components/ui/button";
import { Ban, Home, LogOut } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error: 404",
};

export default function NotFound() {
  return (
    <div className="max-h-full flex flex-col">
      <div className="mt-16 flex flex-col items-start justify-center gap-2 px-32 py-16">
        <Ban className="size-16" />
        <h1 className="h1">Page not Found</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you were looking for.
          <br />
          Please check the URL or return to the dashboard.
          <br />
          If you think this is a mistake, please report the issue as a bug.
        </p>
        <div className="mt-4 flex gap-4 items-center">
          <Button variant="secondary" href="/app">
            <Home /> Visit Dashboard
          </Button>
          <Button variant="secondary" href="/home">
            <LogOut /> Exit App
          </Button>
        </div>
      </div>
    </div>
  );
}
