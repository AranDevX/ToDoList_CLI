const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../../../../services/user/userService');
const redisClient = require('../../../../services/redis/redisClient');  // Import the Redis client
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Secret key for signing JWT
const secretKey = process.env.JWT_SECRET || 'supersecretkey';

// Route to register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await userService.createUser(username, password);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to login a user and generate a JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.role  // Add the role to the JWT token
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout Route - Blacklist the token
router.post('/logout', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(400).json({ message: 'Token is required for logout' });
    }

    try {
        // Add the token to Redis blacklist with an expiration time
        const decoded = jwt.verify(token, secretKey);
        const expirationTime = decoded.exp - Math.floor(Date.now() / 1000); // Calculate remaining expiration time

        redisClient.setex(token, expirationTime, 'blacklisted');

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error during logout', error });
    }
});

// Middleware to check if token is blacklisted
const checkIfTokenBlacklisted = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    redisClient.get(token, (err, reply) => {
        if (reply === 'blacklisted') {
            return res.status(401).json({ message: 'Token has been blacklisted' });
        }
        next();
    });
};

// Protected route example
router.get('/protected', checkIfTokenBlacklisted, async (req, res) => {
    res.json({ message: 'This is a protected route, you are authenticated!' });
});

// Connect to the database
prisma.$connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Error connecting to the database:', err));

module.exports = router;
