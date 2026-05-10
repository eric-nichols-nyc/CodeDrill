import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/scalable-static",
  basePath: "/scalable",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
