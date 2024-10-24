const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: 'localhost',  // Redis server address
        port: 6380          // Redis port (update to the new port)
    }
});

// Handle redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Check when Redis client is connected
redisClient.on('connect', () => {
    console.log('Redis client connected');
});

// Open the Redis connection
(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();

module.exports = redisClient;
