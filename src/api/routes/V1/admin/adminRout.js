const express = require('express');
const checkAdmin = require('../../../middlewares/checkAdminMiddleware');  // Ensure admin access
const authenticateToken = require('../../../middlewares/authMiddleware');  // Ensure user is authenticated
const { PrismaClient } = require('@prisma/client');  // Use Prisma to interact with your DB

const prisma = new PrismaClient();
const router = express.Router();

// Admin-only route to get all users
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

// Admin-only route to update user role
router.put('/user/:id/role', authenticateToken, checkAdmin, async (req, res) => {
    const userId = parseInt(req.params.id);
    const { newRole } = req.body;  // Expect new role in the request body

    try {
        const updatedUser = await adminService.updateUserRole(userId, newRole);  // Update user role
        res.json({ message: 'User role updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
