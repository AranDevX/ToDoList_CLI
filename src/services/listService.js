// src/services/listService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all lists along with tasks
const listAllLists = async () => {
    return await prisma.lists.findMany({
        where: { soft_delete: false },
        include: { tasks: true }
    });
};

// Read tasks from a specific list
const readListTasks = async (listName) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false },
        include: { tasks: true }
    });

    if (list) {
        return list.tasks;
    } else {
        throw new Error(`List "${listName}" not found.`);
    }
};

// Create a list and add a task
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

// Mark a task as completed
const completeTask = async (listName, taskTitle) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    });

    if (list) {
        const task = await prisma.tasks.findFirst({
            where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false }
        });

        if (task) {
            await prisma.tasks.update({
                where: { task_id: task.task_id },
                data: { completed: true }
            });
        } else {
            throw new Error(`Task "${taskTitle}" not found in list "${listName}".`);
        }
    } else {
        throw new Error(`List "${listName}" not found.`);
    }
};

// Update a task in a list
const updateTask = async (listName, oldTaskTitle, newTaskTitle, newDeadline = null) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    });

    if (list) {
        const task = await prisma.tasks.findFirst({
            where: { task_title: oldTaskTitle, list_id: list.list_id, soft_delete: false }
        });

        if (task) {
            await prisma.tasks.update({
                where: { task_id: task.task_id },
                data: {
                    task_title: newTaskTitle,
                    deadline: newDeadline ? new Date(newDeadline) : task.deadline
                }
            });
        } else {
            throw new Error(`Task "${oldTaskTitle}" not found in list "${listName}".`);
        }
    } else {
        throw new Error(`List "${listName}" not found.`);
    }
};

// Soft delete a list
const deleteList = async (listName) => {
    await prisma.lists.updateMany({
        where: { list_name: listName, soft_delete: false },
        data: { soft_delete: true }
    });
};

// Soft delete a task from a list
const deleteTask = async (listName, taskTitle) => {
    const list = await prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    });

    if (list) {
        await prisma.tasks.updateMany({
            where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false },
            data: { soft_delete: true }
        });
    } else {
        throw new Error(`List "${listName}" not found.`);
    }
};

module.exports = {
    createListTask,
    completeTask,
    listAllLists,
    readListTasks,
    updateTask,
    deleteList,
    deleteTask
};
