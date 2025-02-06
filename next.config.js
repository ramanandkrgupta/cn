/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['gray-matter'],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  images: {
    unoptimized: true,
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'github.com',
      'www.notesmates.in',
      'notesmates.in',
      'picsum.photos',
      'files.edgestore.dev',
      'res.cloudinary.com',
      'api.dicebear.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      {
        source: "/instagram",
        destination: "https://www.instagram.com/notesmates.in/",
        permanent: true,
      },
      {
        source: "/whatsapp1",
        destination: "https://chat.whatsapp.com/CTg5k3RuKreFOd4iBCDOmh",
        permanent: true,
      },
      {
        source: "/whatsapp2",
        destination: "https://chat.whatsapp.com/LSso4gdhnpXJIWI6VtE22a",
        permanent: true,

      },
    ];
  },
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
  experimental: {
    serverActions: {}, // Fixed: Changed from true to an empty object
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        stream: false,
        crypto: false,
      };
    }
    config.module.rules.push({
      test: /\.(pdf)$/i,
      type: 'asset/resource'
    });
    return config;
  },
};

// PWA Configuration
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

// Export configuration
module.exports = withPWA(nextConfig);
