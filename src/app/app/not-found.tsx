import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error: 404",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-start justify-center gap-2 px-32 py-16">
      <h1 className="h1">Not Found</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
    </div>
  );
}
