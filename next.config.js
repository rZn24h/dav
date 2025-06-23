/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization is a top priority for performance.
  // This configuration allows loading images from Firebase Storage.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Other configurations
  compress: true,
  poweredByHeader: false,
  
  // Experimental features for performance
  experimental: {
    // optimizeCss: true, // Disabled: Caused 'critters' module not found error on Vercel build
    optimizePackageImports: ['bootstrap', 'react-icons', 'bootstrap-icons'],
  },

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
      };
    }

    return config;
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

module.exports = nextConfig; 