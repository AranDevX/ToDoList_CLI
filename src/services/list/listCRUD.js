const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all lists for the authenticated user
const listAllLists = async (user_id) => {
    return await prisma.lists.findMany({
        where: { user_id, soft_delete: false },
        include: { tasks: true }  // Include tasks in the response if needed
    });
};

// Create a new list for the authenticated user
const createList = async (listName, user_id) => {
    return await prisma.lists.create({
        data: { list_name: listName, user_id, soft_delete: false }
    });
};

// Soft delete a list for a specific user
const deleteList = async (listName, user_id) => {
    return await prisma.lists.updateMany({
        where: { list_name: listName, user_id, soft_delete: false },
        data: { soft_delete: true }
    });
};

module.exports = {
    listAllLists,
    createList,
    deleteList,
};
