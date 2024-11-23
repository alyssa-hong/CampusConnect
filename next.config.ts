import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React strict mode
  images: {
    domains: [
      'encrypted-tbn0.gstatic.com',
      'upload.wikimedia.org',
      'www.hubspot.com',
      'via.placeholder.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.hubspot.com',
      },
    ],
  },
  transpilePackages: ['next-auth'],
  experimental: {
    appDir: false, // Disable appDir if it's causing issues
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false }; // Fix `fs` module issues on the client side
    }
    return config;
  },
  env: {
    API_URL: process.env.API_URL, // Example environment variable
  },
};

export default nextConfig;
