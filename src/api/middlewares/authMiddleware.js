const jwt = require('jsonwebtoken');
const redisClient = require('../../services/redis/redisClient'); // Make sure you have the Redis client setup
const secretKey = process.env.JWT_SECRET || 'supersecretkey';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    // Check if the token is blacklisted
    try {
        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return res.status(403).json({ message: 'Token is blacklisted' });
        }
    } catch (error) {
        console.error('Error checking token in Redis:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    try {
        const user = jwt.verify(token, secretKey);
        req.user = user;  // Attach user info (including role) to the request
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token has expired' });
        }
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;

