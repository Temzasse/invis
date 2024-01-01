export const config = {
  IS_SERVER: typeof window === 'undefined',
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  // Random client id for WS communication purposes
  CLIENT_ID: Math.random().toString(36).substring(2, 15),
};
