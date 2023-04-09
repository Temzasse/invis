import superjson from 'superjson';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { type AppRouter } from '~server/api/root';

export const api = createTRPCNext<AppRouter>({
  config() {
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
        }),
      ],
    };
  },
});

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.FLY_REGION) {
    return `https://${process.env.FLY_APP_NAME}.${process.env.FLY_REGION}.fly.dev`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
