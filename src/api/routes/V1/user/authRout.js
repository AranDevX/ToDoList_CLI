const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const userService = require('../../../../services/user/userService');
const { registerValidation, loginValidation } = require('../../../../validation/authValidation');  // Import Joi validation

// Corrected path for the middleware
const authenticateToken = require('../../../../api/middlewares/authMiddleware');
const redisClient = require('../../../../redisClient');  // Redis client for blacklisting tokens

const prisma = new PrismaClient();
const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'supersecretkey';

// Route to register a new user
router.post('/register', async (req, res) => {
    console.log('Register route hit');
    
    // Validate request body with Joi
    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password, role = 'user' } = req.body;
    try {
        // Create new user
        const newUser = await userService.createUser(username, password, role);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to login a user and generate a JWT
router.post('/login', async (req, res) => {
    // Validate request body with Joi
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await prisma.users.findUnique({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT including the user's role
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.role  // Include the role in the token
            },
            secretKey,
            { expiresIn: '1h' }  // Token valid for 1 hour
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to logout (blacklist the token)
router.post('/logout', authenticateToken, (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    // Set token in Redis with expiration time
    const expiresIn = 60 * 60;  // 1 hour (adjust based on token expiration)
    redisClient.set(token, 'blacklisted', 'EX', expiresIn, (err, reply) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Connect to the database
prisma.$connect()
    .then(() => console.log("Connected to the database"))
    .catch(err => console.error("Error connecting to the database: ", err));

module.exports = router;
