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
              onOpen() {
                console.log('WebSocket connection opened');
              },
              onClose() {
                console.log('WebSocket connection closed');
              },
              retryDelayMs(attemptIndex) {
                // Retry immediately
                if (attemptIndex === 0) return 0;

                // Retry after 1s, 2s, 4s, 8s, 16s, 32s, 60s, 60s, ...
                return Math.min(1000 * 2 ** attemptIndex, 60000);
              },
            }),
          }),
          false: httpBatchLink({
            url: `${getApiBaseUrl()}/api/trpc`,
          }),
        }),
      ],
    };
  },
});

function getApiBaseUrl() {
  // Browser should use relative path
  if (!config.IS_SERVER) return '';

  // These are set by Fly.io runtime
  const region = process.env.FLY_REGION ?? '';
  const appName = process.env.FLY_APP_NAME ?? '';

  // For SSR we need to use full url
  if (!region || !appName) {
    return 'http://localhost:3000';
  }

  // Use https:// for production
  return `https://${appName}.${region}.fly.dev`;
}

function getWsUrl() {
  if (config.NODE_ENV === 'development') {
    return 'ws://localhost:3001';
  }

  // WebSocket connection is made only on the client but this code is also
  // executed during SSR so we need to be a bit defensive here and return
  // a valid url unless the build fails...
  if (config.IS_SERVER) {
    return 'ws://localhost';
  }

  const { hostname } = window.location;

  // Support running the prod version of the app locally, note that the WebSocket
  // handler is bundled with the HTTP API server so we need to define the port
  if (hostname === 'localhost') {
    return 'ws://localhost:3000';
  }

  // Use wss:// for production, note that we don't have access to the Fly.io
  // runtime env variables here which is why we just use the hostname
  return `wss://${hostname}`;
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
