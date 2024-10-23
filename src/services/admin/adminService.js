const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Fetch all users from the database (admin only)
 */
const getAllUsers = async () => {
    try {
        const users = await prisma.users.findMany();  // Changed 'user' to 'users'
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);  // Added detailed logging
        throw new Error('Error fetching users from the database');
    }
};

/**
 * Update a user's role (admin only)
 * @param {number} userId - The ID of the user to update
 * @param {string} newRole - The new role to assign (e.g., 'admin' or 'user')
 */
const updateUserRole = async (userId, newRole) => {
    try {
        const user = await prisma.users.update({  // Changed 'user' to 'users'
            where: { user_id: userId },  // Use the correct field name 'user_id'
            data: { role: newRole }  // Update the role
        });
        return user;
    } catch (error) {
        console.error('Error updating user role:', error);  // Added detailed logging
        throw new Error('Error updating user role');
    }
};

module.exports = {
    getAllUsers,
    updateUserRole
};
