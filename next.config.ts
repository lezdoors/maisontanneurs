import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
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
