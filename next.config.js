/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/upload/:path*",
        destination: "https://livepeer.studio/api/:path*", // Proxy to Backend
      },
      {
        source: "/api/:path*",
        destination: "https://livepeer.com/api/:path*", // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
