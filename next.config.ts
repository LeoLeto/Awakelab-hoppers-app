import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // El caché persistente de Turbopack en dev (activado por defecto desde
    // Next 16.1) provoca panics intermitentes de Turbopack. Lo desactivamos.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
