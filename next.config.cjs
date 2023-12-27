const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  rewrites: async () => {
    return [
      { source: '/healthcheck', destination: '/api/healthcheck' },
      { source: '/join', destination: '/api/project/join' },
    ];
  },
  redirects: async () => {
    return [
      {
        source: '/app',
        destination: '/app/home',
        permanent: true,
      },
    ];
  },
};

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = require('@serwist/next').default({
      swSrc: './client/components/pwa/sw.ts',
      swDest: 'public/sw.js',
    });
    return withSerwist(nextConfig);
  }
  return nextConfig;
};
