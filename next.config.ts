import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  
  // ─── Large file uploads support ───────────────────────────────
  // Note: For file uploads larger than ~4.5MB, use API routes instead of Server Actions
  // This is due to Vercel's function size and memory constraints
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
      allowedOrigins: ["*"],
    },
  },

  // ─── Production optimizations ───────────────────────────────
  poweredByHeader: false,
  output: "standalone",

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
