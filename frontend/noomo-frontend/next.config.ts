import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  module.exports = {
    allowedDevOrigins: ['noomo.skue.hackclub.app'],
  }
  reactCompiler: true,
};

export default nextConfig;
