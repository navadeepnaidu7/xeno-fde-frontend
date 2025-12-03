import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for optimized Docker/Railway deployment
  output: "standalone",
  
  // Allow images from external domains if needed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
