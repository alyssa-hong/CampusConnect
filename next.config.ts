/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'encrypted-tbn0.gstatic.com',
      'upload.wikimedia.org',
      'www.hubspot.com', // Add this hostname
    ],
  },
};

module.exports = nextConfig;
