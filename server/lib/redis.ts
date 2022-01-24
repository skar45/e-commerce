import { createClient } from 'redis';
import { dbError } from '../middlewares/errorhandler';

const redisClient = createClient({ socket: { host: 'cache' } });

(async () => {
  await redisClient.connect();
  redisClient.on('error', (err) => {
    console.error(err);
    throw dbError();
  });
})();

export const clearCache = async () => {
  await redisClient.flushAll();
};

export const redisDisconnect = async () => {
  await redisClient.disconnect();
};

export default redisClient;
