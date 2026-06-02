import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/logo.png",
        search: "?v=20260420-1",
      },
      {
        pathname: "/login-illustration.png",
      },
    ],
  },
};

export default nextConfig;
