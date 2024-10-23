const express = require('express');
const checkAdmin = require('../../../middlewares/checkAdminMiddleware');  // Ensure admin access
const adminService = require('../../../../services/admin/adminService');
const authenticateToken = require('../../../middlewares/authMiddleware');

const router = express.Router();

// Admin-only route to get all users
router.get('/users', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const users = await adminService.getAllUsers();  // Fetch users using the admin service
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
        const updatedUser = await adminService.updateUserRole(userId, newRole);  // Use the admin service to update role
        res.json({ message: 'User role updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
