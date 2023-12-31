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
              url: config.WS_URL,
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
  return typeof window !== 'undefined' ? '' : config.API_URL;
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
