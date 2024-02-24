import { createClient } from 'redis';
import config from '../config';
import { logger } from './logger';

const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', error => logger.error('RedisError', error));
redisClient.on('connect', error =>
  logger.info('Redis Connected successfully!', error)
);

// connect the redis
const connect = async (): Promise<void> => {
  await redisClient.connect();
};

export const RedisDatabase = {
  connect,
};
