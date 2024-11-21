import { NextConfig } from 'next'; // Import the type for NextConfig

const nextConfig: NextConfig = {
  images: {
    domains: [
      'encrypted-tbn0.gstatic.com',
      'upload.wikimedia.org',
      'www.hubspot.com', // Add this hostname
      'via.placeholder.com'
    ],
  },
  transpilePackages: ['next-auth'], // Add next-auth to transpile
};

export default nextConfig;
