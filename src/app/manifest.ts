import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Catalyst",
    short_name: "Catalyst",
    description: "A platform for students to expedite their learning process",
    start_url: "/app/",
    scope: "/",
    display: "standalone",
    background_color: "#0f172b",
    theme_color: "#0f172b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "192x192",
        type: "image/x-icon",
      },
      {
        src: "/favicon.ico",
        sizes: "512x512",
        type: "image/x-icon",
      },
    ],
  };
}
