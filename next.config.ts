import { NextConfig } from 'next'; // Import the type for NextConfig

const nextConfig: NextConfig = {
  images: {
    // Merge domains from jennifer-branch
    domains: [
      'encrypted-tbn0.gstatic.com',
      'upload.wikimedia.org',
      'www.hubspot.com',
      'via.placeholder.com',
    ],
    // Merge remotePatterns from main
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
  transpilePackages: ['next-auth'], // Add next-auth to transpile
};

export default nextConfig;
