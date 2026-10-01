/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.mdrcindia.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/lp/imaging/pet-scan-in-gurgaon",
        destination: "/lp/imaging/pet-ct-scan-in-gurgaon",
        permanent: true,
      },
      {
        source: "/lp/imaging/pet-scan-in-gurgaon/:path*",
        destination: "/lp/imaging/pet-ct-scan-in-gurgaon/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/scripts/ajax",
        destination: "/api/landing-page-enquiry",
      },
      {
        source: "/scripts/ajax/:path*",
        destination: "/api/landing-page-enquiry",
      },
    ];
  },
};

module.exports = nextConfig;
