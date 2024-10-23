const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Fetch all users from the database (admin only)
 */
const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany();  // Fetch all users from the DB
        return users;
    } catch (error) {
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
        const user = await prisma.user.update({
            where: { id: userId },  // Find the user by ID
            data: { role: newRole }  // Update the role
        });
        return user;
    } catch (error) {
        throw new Error('Error updating user role');
    }
};

module.exports = {
    getAllUsers,
    updateUserRole
};
