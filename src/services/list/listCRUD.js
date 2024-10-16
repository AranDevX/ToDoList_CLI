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

// Soft delete a list by its ID for a specific user
const deleteList = async (list_id, user_id) => {
    return await prisma.lists.updateMany({
        where: {
            list_id: Number(list_id),
            user_id,
            soft_delete: false  // Only delete lists that haven't been soft deleted yet
        },
        data: { soft_delete: true }  // Mark the list as deleted
    });
};


module.exports = {
    listAllLists,
    createList,
    deleteList,
};
