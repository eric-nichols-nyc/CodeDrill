import { resolve } from "node:path";
import { config } from "dotenv";
import type { NextConfig } from "next";

// Load environment variables from root .env file
config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, "../../.env.local") });

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
