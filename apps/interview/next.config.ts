import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/interview",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
