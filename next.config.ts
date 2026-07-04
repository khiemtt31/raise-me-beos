import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
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
