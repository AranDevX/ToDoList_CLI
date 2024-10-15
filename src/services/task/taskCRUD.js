const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new task in a specific list
const createTask = async (taskTitle, deadline, listId, user_id) => {
    if (!taskTitle.trim()) {
        throw new Error('Task title cannot be empty.');
    }

    const list = await prisma.lists.findFirst({
        where: { list_id: listId, user_id, soft_delete: false }
    });

    if (!list) {
        throw new Error('List not found.');
    }

    return await prisma.tasks.create({
        data: {
            task_title: taskTitle,
            list_id: listId,
            deadline: deadline ? new Date(deadline) : null,
            user_id,
            completed: false,
            soft_delete: false
        }
    });
};

// Complete a task
const completeTask = async (listId, taskId, user_id) => {
    const task = await prisma.tasks.findFirst({
        where: { task_id: taskId, list_id: listId, user_id, soft_delete: false }
    });

    if (!task) {
        throw new Error('Task not found.');
    }

    return await prisma.tasks.update({
        where: { task_id: task.task_id },
        data: { completed: true }
    });
};

// Update a task
const updateTask = async (listId, oldTaskTitle, newTaskTitle, newDeadline = null, user_id) => {
    const list = await prisma.lists.findFirst({
        where: { list_id: listId, user_id, soft_delete: false }
    });

    if (!list) {
        throw new Error('List not found.');
    }

    const task = await prisma.tasks.findFirst({
        where: { task_title: oldTaskTitle, list_id: list.list_id, soft_delete: false }
    });

    if (!task) {
        throw new Error(`Task "${oldTaskTitle}" not found.`);
    }

    return await prisma.tasks.update({
        where: { task_id: task.task_id },
        data: {
            task_title: newTaskTitle,
            deadline: newDeadline ? new Date(newDeadline) : task.deadline
        }
    });
};

// Soft delete a task
const deleteTask = async (listId, taskId, user_id) => {
    return await prisma.tasks.updateMany({
        where: { task_id: taskId, list_id: listId, user_id, soft_delete: false },
        data: { soft_delete: true }
    });
};

module.exports = {
    createTask,
    completeTask,
    updateTask,
    deleteTask,
};
