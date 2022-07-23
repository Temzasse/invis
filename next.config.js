/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  rewrites: async () => {
    return [
      { source: '/healthcheck', destination: '/api/healthcheck' },
      { source: '/join-project', destination: '/api/join-project' },
    ];
  },
  redirects: async () => {
    return [{ source: '/app', destination: '/app/home', permanent: true }];
  },
};

module.exports = nextConfig;
