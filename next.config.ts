import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/assets/**",
      },
      {
        pathname: "/atelier/**",
      },
      {
        pathname: "/brand/**",
      },
      {
        pathname: "/hero/**",
      },
      {
        pathname: "/placeholders/**",
      },
      {
        pathname: "/products/hero/**",
      },
      {
        pathname: "/products/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
