const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all lists along with tasks for a specific user
const listAllLists = async (user_id) => {
    return await prisma.lists.findMany({
        where: { soft_delete: false, user_id }, // Fetch lists only for the authenticated user
        include: { tasks: true } // Include associated tasks
    });
};

// Create a list and add a task
const createListTask = async (listName, taskTitle, deadline = null, user_id) => {
    if (!taskTitle.trim()) {
        throw new Error("Task title cannot be empty.");
    }

    // Find or create the list for the authenticated user
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false, user_id }
    }) || await prisma.lists.create({
        data: { list_name: listName, user_id } // Assign list to the user
    });

    // Check if the task already exists in the list
    const taskExists = await prisma.tasks.findFirst({
        where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false }
    });

    if (taskExists) {
        throw new Error(`Task "${taskTitle}" already exists in list "${listName}".`);
    }

    // Create a new task in the list
    return await prisma.tasks.create({
        data: {
            task_title: taskTitle,
            completed: false,
            list_id: list.list_id,
            deadline: deadline ? new Date(deadline) : null,
            soft_delete: false
        }
    });
};

// Complete a task in a list for a specific user
const completeTask = async (listName, taskTitle, user_id) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false, user_id } // Ensure the list belongs to the user
    });

    if (!list) {
        throw new Error(`List "${listName}" not found for user.`);
    }

    const task = await prisma.tasks.findFirst({
        where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false }
    });

    if (!task) {
        throw new Error(`Task "${taskTitle}" not found in list "${listName}".`);
    }

    return await prisma.tasks.update({
        where: { task_id: task.task_id },
        data: { completed: true }
    });
};

// Update a task in a list for a specific user
const updateTask = async (listName, oldTaskTitle, newTaskTitle, newDeadline = null, user_id) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false, user_id } // Ensure the list belongs to the user
    });

    if (!list) {
        throw new Error(`List "${listName}" not found for user.`);
    }

    const task = await prisma.tasks.findFirst({
        where: { task_title: oldTaskTitle, list_id: list.list_id, soft_delete: false }
    });

    if (!task) {
        throw new Error(`Task "${oldTaskTitle}" not found in list "${listName}".`);
    }

    return await prisma.tasks.update({
        where: { task_id: task.task_id },
        data: {
            task_title: newTaskTitle,
            deadline: newDeadline ? new Date(newDeadline) : task.deadline
        }
    });
};

// Soft delete a list for a specific user
const deleteList = async (listName, user_id) => {
    return await prisma.lists.updateMany({
        where: { list_name: listName, soft_delete: false, user_id }, // Ensure the list belongs to the user
        data: { soft_delete: true }
    });
};

// Soft delete a task from a list for a specific user
const deleteTask = async (listName, taskTitle, user_id) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false, user_id } // Ensure the list belongs to the user
    });

    if (!list) {
        throw new Error(`List "${listName}" not found for user.`);
    }

    return await prisma.tasks.updateMany({
        where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false },
        data: { soft_delete: true }
    });
};

module.exports = {
    listAllLists,
    createListTask,
    completeTask,
    updateTask,
    deleteList,
    deleteTask
};
