const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all lists along with tasks
const listAllLists = async () => {
    return await prisma.lists.findMany({
        where: { soft_delete: false },
        include: { tasks: true }
    });
};

// Create a list and add a task
const createListTask = async (listName, taskTitle, deadline = null) => {
    if (!taskTitle.trim()) {
        throw new Error("Task title cannot be empty.");
    }

    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    }) || await prisma.lists.create({ data: { list_name: listName } });

    const taskExists = await prisma.tasks.findFirst({
        where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false }
    });

    if (taskExists) {
        throw new Error(`Task "${taskTitle}" already exists.`);
    }

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

// Complete a task in a list
const completeTask = async (listName, taskTitle) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    });

    if (!list) {
        throw new Error(`List "${listName}" not found.`);
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

// Update a task in a list
const updateTask = async (listName, oldTaskTitle, newTaskTitle, newDeadline = null) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    });

    if (!list) {
        throw new Error(`List "${listName}" not found.`);
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

// Soft delete a list
const deleteList = async (listName) => {
    return await prisma.lists.updateMany({
        where: { list_name: listName, soft_delete: false },
        data: { soft_delete: true }
    });
};

// Soft delete a task from a list
const deleteTask = async (listName, taskTitle) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    });

    if (!list) {
        throw new Error(`List "${listName}" not found.`);
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
