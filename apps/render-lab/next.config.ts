import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/render-lab-static",
  basePath: "/render-lab",
  cacheComponents: true, // Enable Partial Pre-Rendering (PPR)
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
