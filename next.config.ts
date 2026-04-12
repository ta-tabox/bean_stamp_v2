import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "app", "localhost"],
  reactStrictMode: true,
}

export default nextConfig
