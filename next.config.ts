import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project sits under a parent folder that also has a stray package-lock.json.
  // Pin the workspace root here so Next stops guessing (and warning) on every run.
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
