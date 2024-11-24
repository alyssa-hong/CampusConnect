import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React strict mode
  images: {
    domains: [
      'encrypted-tbn0.gstatic.com',
      'upload.wikimedia.org',
      'www.hubspot.com',
      'via.placeholder.com',
      'campusconnectaws.s3.us-east-2.amazonaws.com'
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
    turbo: {
      rules: {},
    },
  },
  

  env: {
    API_URL: process.env.API_URL, // Example environment variable
  },
};

export default nextConfig;
