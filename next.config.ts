/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
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
        source: "/lp/radio/mri-scan-in-gurgaon",
        destination: "/lp/imaging/mri-scan-in-gurgaon",
        permanent: true,
      },
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
};

module.exports = nextConfig;
