import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

import { AppRouter } from '~server/api/root';

export const api = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (!ctx?.req) return {};

            // To use SSR properly, you need to forward the client's headers to the server
            // This is so you can pass through things like cookies when we're server-side rendering
            // If you're using Node 18, omit the "connection" header
            const { connection: _connection, ...headers } = ctx.req.headers;

            return {
              ...headers,
              // Optional: inform server that it's an SSR request
              'x-ssr': '1',
            };
          },
        }),
      ],
    };
  },
  ssr: true,
});

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }
  if (process.env.FLY_REGION) {
    return `https://${process.env.FLY_APP_NAME}.${process.env.FLY_REGION}.fly.dev`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
