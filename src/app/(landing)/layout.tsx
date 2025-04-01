import React, { ReactNode } from "react";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex flex-col max-w-[120ch] px-12 py-6 mx-auto min-h-screen">
        <>{children}</>
      </main>
    </>
  );
}
