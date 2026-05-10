import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/security-static",
  basePath: "/security",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
