/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable to reduce double rendering in development
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      util: false,
    };
    return config;
  },
  // Include GLB files as assets
  assetPrefix: '',
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig

