import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only Prisma must stay external (native engine). Do not externalize
  // @auth/prisma-adapter — Turbopack rewrites it to a hashed id that fails in Docker.
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
