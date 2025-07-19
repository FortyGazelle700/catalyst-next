import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    optimizePackageImports: ["recharts", "@js-temporal/polyfill"],
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
};

const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = createMDX({});

export default withBundleAnalyzer(withMDX(nextConfig));
