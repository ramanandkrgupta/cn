/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  images: {
    domains: [
      'lh3.googleusercontent.com', // For Google profile photos
      'avatars.githubusercontent.com', // For GitHub profile photos (if you're using GitHub auth)
      'github.com',
      'www.notesmates.in',
      'notesmates.in'
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/api/auth/callback/google',
  //       destination: '/dashboard',
  //       permanent: true,
  //     },
  //   ];
  // },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://www.notesmates.in' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/favicon/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

// Configuration object tells the next-pwa plugin
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

// Export the combined configuration for Next.js with PWA support
module.exports = withPWA(nextConfig);
