/** @type {import('next').NextConfig} */

const nextConfig = {
  staticPageGenerationTimeout: 180,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "api.eazysupplies.com",
      },{
        protocol: "https",
        hostname: "api.eazysupplies.com",
      }
    ],
  },
};

export default nextConfig;
