// /src/api/routes/V1/user/authRout.js
const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing and comparison
const jwt = require('jsonwebtoken'); // For JWT generation
const userService = require('../../../../services/user/userService'); // Custom service to handle user creation
const { PrismaClient } = require('@prisma/client'); // Prisma Client to interact with DB

const prisma = new PrismaClient(); // Initialize Prisma client
const router = express.Router();

// Log to confirm this file is loaded
console.log('authRout.js loaded');

// Secret key for signing JWT
const secretKey = process.env.JWT_SECRET || 'supersecretkey';

// Route to register a new user
router.post('/register', async (req, res) => {
    console.log('Register route hit');  // Log this to check if the route is being hit
    const { username, password } = req.body;
    try {
        const newUser = await userService.createUser(username, password);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Log all registered routes for user
router.stack.forEach(function(r) {
    if (r.route && r.route.path) {
        console.log(`Registered user route: ${r.route.path}`);
    }
});

// Route to login a user and generate a JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await prisma.users.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            secretKey,
            { expiresIn: '1h' } // Token valid for 1 hour
        );

        // Respond with the token
        res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Connect to the database
prisma.$connect()
    .then(() => console.log("Connected to the database"))
    .catch(err => console.error("Error connecting to the database: ", err));

module.exports = router;
