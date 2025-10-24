/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Skip ESLint during production builds in Docker
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;