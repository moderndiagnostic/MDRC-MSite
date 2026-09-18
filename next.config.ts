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
    ];
  },
};

module.exports = nextConfig;
