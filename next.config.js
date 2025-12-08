/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable to reduce double rendering in development
  swcMinify: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      util: false,
    };
    
    // Exclude Farcaster SDK from server-side bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@farcaster/miniapp-sdk');
    }
    
    return config;
  },
  // Include GLB files as assets
  assetPrefix: '',
  experimental: {
    esmExternals: 'loose'
  },
  // Ensure .well-known directory is served correctly
  async headers() {
    return [
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

