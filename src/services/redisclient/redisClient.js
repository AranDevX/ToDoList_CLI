const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
    host: 'localhost',  // Adjust to your Redis server configuration
    port: 6379          // Default Redis port
});

// Handle connection events
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = client;
