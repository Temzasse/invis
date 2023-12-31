import Redis, { type RedisOptions } from 'ioredis';

const options: RedisOptions = {
  family: 6,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    if (times > 3) {
      throw new Error(`[Redis] Could not connect after ${times} attempts`);
    }

    return Math.min(times * 200, 1000);
  },
};

export const createRedisClient = () => {
  try {
    const redis = new Redis(process.env.REDIS_URL ?? '', options);

    redis.on('connection', (data) => {
      console.log('[Redis] Connected.', data);
    });

    redis.on('error', (error: unknown) => {
      console.warn('[Redis] Error connecting!', error);
    });

    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance!`);
  }
};

const publisher = createRedisClient();
const subscriber = createRedisClient();

export function publish<T>(channel: string, data: T) {
  publisher.publish(channel, JSON.stringify(data)).catch((error) => {
    console.error('[Redis] Error publishing message!', error);
  });
}

export function subscribe<T>(channel: string, cb: (data: T) => void) {
  subscriber.subscribe(channel).catch((error) => {
    console.error('[Redis] Error subscribing to channel!', error);
  });

  subscriber.on('message', (channel, message) => {
    if (channel === channel) {
      try {
        const data = JSON.parse(message);
        cb(data as T);
      } catch (error) {
        console.error('[Redis] Error parsing message!', error);
      }
    }
  });

  return () => {
    subscriber.unsubscribe(channel);
  };
}
