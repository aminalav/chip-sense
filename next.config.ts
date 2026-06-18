import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["react-map-gl"],
  /** Prefer this app root when another lockfile exists above the repo */
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
