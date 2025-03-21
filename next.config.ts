import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["127.0.0.1", "sfphdtrwkifjgfyumrbc.supabase.co"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "sfphdtrwkifjgfyumrbc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
