/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  rewrites: async () => {
    return [{ source: '/healthcheck', destination: '/api/healthcheck' }];
  },
};

module.exports = nextConfig;
