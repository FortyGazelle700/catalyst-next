import { type ReactNode } from "react";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-[120ch] flex-col px-4 py-6 sm:px-12">
        <>{children}</>
      </main>
    </>
  );
}
