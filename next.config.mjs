import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  eslint: {
    ignoreDuringBuilds: true,
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

export default async function configure(phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import('@serwist/next')).default({
      swSrc: './client/components/pwa/sw.ts',
      swDest: 'public/sw.js',
    });
    return withSerwist(nextConfig);
  }
  return nextConfig;
}
