import type { Metadata, Viewport } from "next";
import { Providers } from "../components/util/providers";

import "./globals.css";
import "./pro.globals.css";
import { auth } from "@/server/auth";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: {
    template: "%s - Catalyst",
    default: "Catalyst",
  },
  description: "A platform for students to expedite their learning process",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/favicon.ico" },
    { rel: "icon", url: "/favicon.ico" },
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    title: "Catalyst",
    statusBarStyle: "black-translucent",
    capable: true,
    startupImage: "/favicon.ico",
  },
  metadataBase: new URL("https://catalyst.bluefla.me"),
  openGraph: {
    title: "Catalyst",
    description: "A platform for students to expedite their learning process",
    url: "https://catalyst.bluefla.me",
    siteName: "Catalyst",
    images: [
      {
        url: "https://catalyst.bluefla.me/favicon.ico",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalyst",
    description: "A platform for students to expedite their learning process",
    images: ["https://catalyst.bluefla.me/favicon.ico"],
    creator: "@catalyst",
    site: "@catalyst",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const cks = await cookies();

  return (
    <html
      lang="en"
      className={`color-theme-${cks.get("color-theme")?.value ?? "default"}`}
      suppressHydrationWarning
    >
      <body className="bg-sidebar !pt-[env(safe-area-inset-top)] !pr-[env(safe-area-inset-right)] !pb-[env(safe-area-inset-bottom)] !pl-[env(safe-area-inset-left)] antialiased">
        <Providers user={session?.user}>{children}</Providers>
      </body>
    </html>
  );
}
