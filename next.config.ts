/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.mdrcindia.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
