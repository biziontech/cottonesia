/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alex.wahyuachmad.com',
      },
      {
        protocol: 'https',
        hostname: 'alex_ac_mobil_api.test',
        pathname: '/storage/**',
      },
    ],
    domains: ['picsum.photos', 'i.pravatar.cc'],
    //unoptimized: true,
    qualities: [50, 70, 75],
  },
};

module.exports = nextConfig;
