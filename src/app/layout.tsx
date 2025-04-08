import type { Metadata } from "next";
import { Providers } from "../components/util/providers";

import "./globals.css";
import { auth } from "@/server/auth";

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
  metadataBase: new URL("https://catalyst.vercel.app"),
  openGraph: {
    title: "Catalyst",
    description: "A platform for students to expedite their learning process",
    url: "https://catalyst.vercel.app",
    siteName: "Catalyst",
    images: [
      {
        url: "https://catalyst.vercel.app/favicon.ico",
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
    images: ["https://catalyst.vercel.app/favicon.ico"],
    creator: "@catalyst",
    site: "@catalyst",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers user={session?.user}>{children}</Providers>
      </body>
    </html>
  );
}
