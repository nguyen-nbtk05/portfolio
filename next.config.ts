import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingIncludes: {
    "/*": ["./src/content/blog/**/*"],
  },
};

export default nextConfig;
