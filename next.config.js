const runtimeCaching = require('next-pwa/cache');

const withPWA = require('next-pwa')({
  // Use prodution mode to reduce logging:
  // https://github.com/shadowwalker/next-pwa#tips
  mode: 'production',
  dest: 'public',
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
    modularizeImports: {
      lodash: {
        transform: 'lodash/{{member}}',
      },
    },
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

module.exports = withPWA(nextConfig);
