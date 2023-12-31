import { createServer } from 'http';
import { parse } from 'url';
import { WebSocketServer } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';

import { createWebSocketTRPCContext } from './api/trpc';
import { appRouter } from './api/root';

// HACK: importing `next` with `import` doesn't seem to work after building with `tsc`...
const next = require('next');

/**
 * NOTE: this is based on the following TRPC example setup plus Next.js guide:
 * - https://github.com/trpc/examples-next-prisma-websockets-starter/blob/main/src/server/prodServer.ts
 * - https://nextjs.org/docs/pages/building-your-application/configuring/custom-server
 */

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = 'localhost';
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

void app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    if (!req.url) return;
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ server });

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: createWebSocketTRPCContext as any,
  });

  wss.on('connection', (ws) => {
    console.log(`WebSocket connection (clients: ${wss.clients.size})`);
    ws.once('close', () => {
      console.log(`WebSocket connection closed (clients: ${wss.clients.size})`);
    });
    ws.on('error', (err) => console.error(err));
  });

  server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });

  server.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM');
    handler.broadcastReconnectNotification();
  });
});
