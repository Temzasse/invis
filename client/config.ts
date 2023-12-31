const isLocal = !process.env.FLY_REGION;
const PORT = parseInt(process.env.PORT ?? '3000', 10);
const WS_PORT = parseInt(process.env.WS_PORT ?? '3001', 10);
const FLY_REGION = process.env.FLY_REGION ?? '';
const FLY_APP_NAME = process.env.FLY_APP_NAME ?? '';

export const config = {
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  // Random client id for WS communication purposes
  CLIENT_ID: Math.random().toString(36).substring(2, 15),
  API_URL: isLocal
    ? `http://localhost:${PORT ?? 3000}`
    : `https://${FLY_APP_NAME}.${FLY_REGION}.fly.dev`,
  WS_URL: isLocal
    ? `ws://localhost:${WS_PORT ?? 3001}`
    : `wss://${FLY_APP_NAME}.${FLY_REGION}.fly.dev`,
};
