/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@supabase/ssr'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false,
    };
    return config;
  },
};

module.exports = nextConfig;