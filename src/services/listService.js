// src/services/listService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Service to get all lists
const getAllLists = async () => {
    return await prisma.lists.findMany({
        where: { soft_delete: false },
        include: { tasks: true }
    });
};

// Service to create a list and task
const createListTask = async (listName, taskTitle, deadline = null) => {
    if (!taskTitle.trim()) throw new Error("Task title cannot be empty.");

    let list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    });

    if (!list) {
        list = await prisma.lists.create({ data: { list_name: listName } });
    }

    const taskExists = await prisma.tasks.findFirst({
        where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false }
    });

    if (taskExists) throw new Error(`Task "${taskTitle}" already exists.`);

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

// Other services for updating tasks, marking tasks complete, deleting tasks and lists

module.exports = {
    getAllLists,
    createListTask,
    // other services for task and list management
};

