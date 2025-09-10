import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tuweb.com",
      },
      {
        protocol: "https",
        hostname: "glbwyjwetgqxsjncpyhe.supabase.co",
      },
    ],
  },
};

export default nextConfig;
