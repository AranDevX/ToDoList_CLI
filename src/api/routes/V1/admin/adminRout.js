const express = require('express');
const checkAdmin = require('../../../middlewares/checkAdminMiddleware');  // Ensure admin-only access
const authenticateToken = require('../../../middlewares/authMiddleware');  // Ensure user is authenticated
const { PrismaClient } = require('@prisma/client');  // Use Prisma to interact with your DB

const prisma = new PrismaClient();
const router = express.Router();

// Admin-only route to get all users (example)
router.get('/users', authenticateToken, checkAdmin, async (req, res) => {
    try {
        // Example logic: Fetch all users (this can be modified as per your requirements)
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
