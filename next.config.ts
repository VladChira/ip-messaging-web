import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: false,
  skipWaiting: true,
  // buildExcludes: [/middleware-manifest\.json$/], // if you hit App Router issues
});

const nextConfig: NextConfig = {
  basePath: '/messaging',
  trailingSlash: true
};

export default withPWA(nextConfig);
