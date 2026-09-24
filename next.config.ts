import type { NextConfig } from "next";

const isDocker = process.env.DOCKER_BUILD === "true";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isDocker ? { output: "standalone" } : {}),
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "assets.techbox.in",
      },
    ],
  },
};

export default nextConfig;
