export const config = {
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  FLY_REGION: process.env.FLY_REGION ?? '',
  FLY_APP_NAME: process.env.FLY_APP_NAME ?? '',
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  WS_PORT: parseInt(process.env.WS_PORT ?? '3001', 10),
  // Random client id for WS communication purposes
  CLIENT_ID: Math.random().toString(36).substring(2, 15),
};
