import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack's dev filesystem cache corrupts on Windows with the duplicate
    // better-auth install, causing "conflicting effects for the same key"
    // panics on /auth/*. Disable it until node_modules is deduplicated.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
