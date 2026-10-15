import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow a 3 MB photo plus the product fields and multipart overhead.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
