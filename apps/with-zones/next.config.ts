import type { NextConfig } from "next";

const SECURITY_URL = (process.env.SECURITY_URL ?? "http://localhost:3022").replace(
  /\/$/,
  ""
);
const OPTIMIZATION_URL = (
  process.env.OPTIMIZATION_URL ?? "http://localhost:3019"
).replace(/\/$/, "");
const SCALABLE_URL = (
  process.env.SCALABLE_URL ?? "http://localhost:3020"
).replace(/\/$/, "");
const RENDER_LAB_URL = (
  process.env.RENDER_LAB_URL ?? "http://localhost:3012"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },

  rewrites() {
    return [
      {
        source: "/security",
        destination: `${SECURITY_URL}/security`,
      },
      {
        source: "/security/:path+",
        destination: `${SECURITY_URL}/security/:path+`,
      },
      {
        source: "/security-static/_next/:path+",
        destination: `${SECURITY_URL}/security-static/_next/:path+`,
      },
      {
        source: "/optimization",
        destination: `${OPTIMIZATION_URL}/optimization`,
      },
      {
        source: "/optimization/:path+",
        destination: `${OPTIMIZATION_URL}/optimization/:path+`,
      },
      {
        source: "/optimization-static/_next/:path+",
        destination: `${OPTIMIZATION_URL}/optimization-static/_next/:path+`,
      },
      {
        source: "/scalable",
        destination: `${SCALABLE_URL}/scalable`,
      },
      {
        source: "/scalable/:path+",
        destination: `${SCALABLE_URL}/scalable/:path+`,
      },
      {
        source: "/scalable-static/_next/:path+",
        destination: `${SCALABLE_URL}/scalable-static/_next/:path+`,
      },
      {
        source: "/render-lab",
        destination: `${RENDER_LAB_URL}/render-lab`,
      },
      {
        source: "/render-lab/:path+",
        destination: `${RENDER_LAB_URL}/render-lab/:path+`,
      },
      {
        source: "/render-lab-static/_next/:path+",
        destination: `${RENDER_LAB_URL}/render-lab-static/_next/:path+`,
      },
    ];
  },
};

export default nextConfig;
