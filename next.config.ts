import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Situs ini bergantung pada cookie bahasa (id/my/en) di setiap halaman publik,
  // jadi hampir semua rute bersifat dinamis. Cache Components dimatikan agar
  // pola Laravel (locale per-sesi, tanpa prefix URL) tetap sama persis.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Aset lama dirujuk dari DB sebagai /storage/... dan /images/...
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://anqebirxzaydpnmqllnr.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_Y_9cwSSRPGlRm8h-Dg8htw_gt_-KS7B",
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: false },
      { source: "/tour", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
