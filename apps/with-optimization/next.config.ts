import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/optimization-static",
  basePath: "/optimization",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzer(nextConfig);
