// /src/api/routes/V1/user/authRout.js
const express = require('express');
const bcrypt = require('bcryptjs');  // For password hashing
const jwt = require('jsonwebtoken');  // For JWT generation
const userService = require('../../../../services/user/userService');  // Service to handle user creation
const { PrismaClient } = require('@prisma/client');  // Prisma Client for DB interaction

const prisma = new PrismaClient();  // Initialize Prisma client
const router = express.Router();

// Log to confirm this file is loaded
console.log('authRout.js loaded');

// Secret key for signing JWT
const secretKey = process.env.JWT_SECRET || 'supersecretkey';

// Route to register a new user
router.post('/register', async (req, res) => {
    console.log('Register route hit');
    const { username, password, role = 'user' } = req.body;  // Default role to 'user' if not provided
    try {
        // Ensure username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Ensure role is valid (optional: if you want to restrict role creation)
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role provided' });
        }

        // Create the user
        const newUser = await userService.createUser(username, password, role);  // Pass role to the service
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to login a user and generate a JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find the user by username
        const user = await prisma.users.findUnique({
            where: { username }
        });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT and include the user's role
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.role  // Include the role in the token
            },
            secretKey,
            { expiresIn: '1h' }  // Token expires in 1 hour
        );

        // Send the token to the client
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
