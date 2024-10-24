const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../../../../services/user/userService');
const { PrismaClient } = require('@prisma/client');
const redisClient = require('../../../../services/redis/redisClient'); // Redis client for token blacklisting
const authenticateToken = require('../../../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../../../../validation/authValidation');

const prisma = new PrismaClient();
const router = express.Router();

// Secret key for signing JWT
const secretKey = process.env.JWT_SECRET || 'supersecretkey';

// Route to register a new user
router.post('/register', async (req, res) => {
    const { error } = validateRegister(req.body);  // Validate request body
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password, role } = req.body;
    try {
        const newUser = await userService.createUser(username, password, role);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to login a user and generate a JWT
router.post('/login', async (req, res) => {
    const { error } = validateLogin(req.body);  // Validate request body
    if (error) return res.status(400).json({ message: error.details[0].message });

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
            { user_id: user.user_id, username: user.username, role: user.role },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to logout a user by blacklisting the JWT token in Redis
router.post('/logout', authenticateToken, async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];  // Extract token from Authorization header
    try {
        await redisClient.set(token, 'blacklisted', { EX: 3600 }); // Expire the token in 1 hour
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
});

// Connect to the database
prisma.$connect()
    .then(() => console.log("Connected to the database"))
    .catch(err => console.error("Error connecting to the database: ", err));

module.exports = router;
