import superjson from 'superjson';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { createTRPCNext } from '@trpc/next';

import {
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from '@trpc/client';

import { type AppRouter } from '~/server/api/root';

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) => {
            return (
              process.env.NODE_ENV === 'development' ||
              (opts.direction === 'down' && opts.result instanceof Error)
            );
          },
        }),
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: wsLink({
            client: createWSClient({
              url: getWsUrl(),
            }),
          }),
          false: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
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

function getWsUrl() {
  if (process.env.FLY_REGION) {
    return `wss://${process.env.FLY_APP_NAME}.${process.env.FLY_REGION}.fly.dev`;
  }
  return `ws://localhost:${process.env.WS_PORT ?? 3001}`;
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
