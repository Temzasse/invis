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
import { config } from '../config';

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) => {
            return (
              config.NODE_ENV === 'development' ||
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
  if (config.FLY_REGION) {
    return `https://${config.FLY_APP_NAME}.${config.FLY_REGION}.fly.dev`;
  }
  return `http://localhost:${config.PORT ?? 3000}`;
}

function getWsUrl() {
  if (config.FLY_REGION) {
    return `wss://${config.FLY_APP_NAME}.${config.FLY_REGION}.fly.dev`;
  }
  return `ws://localhost:${config.WS_PORT ?? 3001}`;
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
