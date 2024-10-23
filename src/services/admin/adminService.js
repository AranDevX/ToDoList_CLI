const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Fetch all users from the database (admin only)
 */
const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany();
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
            where: { id: userId },
            data: { role: newRole }
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
