import { createClient } from 'redis';

import { logger } from './logger';
import config from '../config';

const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', error => logger.error('RedisError', error));
redisClient.on('connect', error => {
  if (error) {
    logger.error('RedisError', error);
  }
  logger.info('Redis Connected successfully!');
});

// connect the redis
const connect = async (): Promise<void> => {
  await redisClient.connect();
};

export const RedisDatabase = {
  connect,
};
