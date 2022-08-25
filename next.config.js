const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    swcPlugins: [['next-superjson-plugin', { excluded: [] }]],
  },
  rewrites: async () => {
    return [
      { source: '/healthcheck', destination: '/api/healthcheck' },
      { source: '/join', destination: '/api/project/join' },
    ];
  },
  redirects: async () => {
    return [{ source: '/app', destination: '/app/home', permanent: true }];
  },
};

module.exports = withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
});
