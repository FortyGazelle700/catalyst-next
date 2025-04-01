import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    optimizePackageImports: ["recharts", "@js-temporal/polyfill"],
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
};

const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = createMDX({});

export default withBundleAnalyzer(withMDX(nextConfig));
