import redis from 'redis';

// Create a Redis client with explicit connection retries
const redisClient = redis.createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,  // Correct port for Redis
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        return new Error('Too many connection attempts, giving up.');
      }
      // Retry after 2 seconds
      return 2000;
    },
  },
});

// Handle connection success
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Explicitly connect to Redis and handle errors
async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log('Redis client connected successfully');
  } catch (err) {
    console.error('Failed to connect to Redis:', err.message);
  }
}

connectToRedis();

export default redisClient;
