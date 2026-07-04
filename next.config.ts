import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "paralleluniverse.com.ua",
      },
    ],
  },
};

export default nextConfig;
