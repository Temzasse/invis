import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';

import { appRouter } from './api/root';
import { createWebSocketTRPCContext } from './api/trpc';

/**
 * WebSocket Server for local development.
 * In production the custom Next.js server handles both HTTP and WebSocket requests.
 * See `server/server.prod.ts` for more details.
 */

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createWebSocketTRPCContext as any,
});

wss.on('connection', (ws) => {
  console.log(`Connection opened (clients: ${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`Connection closed (clients: ${wss.clients.size})`);
  });
});

console.log(`WebSocket Server listening on ws://localhost:${PORT}`);

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
