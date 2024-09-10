// src/services/listService.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Get all lists along with tasks 
const listAllLists = () => {
    return prisma.lists.findMany({
        where: { soft_delete: false },
        include: { tasks: true }
    });
};

// Read tasks from a specific list 
const readListTasks = (listName) => {
    return prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false },
        include: { tasks: true }
    }).then((list) => {
        if (list) {
            return list.tasks;
        } else {
            throw new Error(`List "${listName}" not found.`);
        }
    });
};

// Create a list and add a task 
const createListTask = (listName, taskTitle, deadline = null) => {
    if (!taskTitle.trim()) {
        return Promise.reject(new Error("Task title cannot be empty."));
    }

    return prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    }).then((list) => {
        if (!list) {
            return prisma.lists.create({ data: { list_name: listName } });
        }
        return list;
    }).then((list) => {
        return prisma.tasks.findFirst({
            where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false }
        }).then((taskExists) => {
            if (taskExists) {
                throw new Error(`Task "${taskTitle}" already exists.`);
            }
            return prisma.tasks.create({
                data: {
                    task_title: taskTitle,
                    completed: false,
                    list_id: list.list_id,
                    deadline: deadline ? new Date(deadline) : null,
                    soft_delete: false
                }
            });
        });
    });
};

// Mark a task as completed 
const completeTask = (listName, taskTitle) => {
    return prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    }).then((list) => {
        if (!list) {
            throw new Error(`List "${listName}" not found.`);
        }
        return prisma.tasks.findFirst({
            where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false }
        });
    }).then((task) => {
        if (!task) {
            throw new Error(`Task "${taskTitle}" not found in list "${listName}".`);
        }
        return prisma.tasks.update({
            where: { task_id: task.task_id },
            data: { completed: true }
        });
    });
};

// Update a task in a list 
const updateTask = (listName, oldTaskTitle, newTaskTitle, newDeadline = null) => {
    return prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    }).then((list) => {
        if (!list) {
            throw new Error(`List "${listName}" not found.`);
        }
        return prisma.tasks.findFirst({
            where: { task_title: oldTaskTitle, list_id: list.list_id, soft_delete: false }
        });
    }).then((task) => {
        if (!task) {
            throw new Error(`Task "${oldTaskTitle}" not found in list "${listName}".`);
        }
        return prisma.tasks.update({
            where: { task_id: task.task_id },
            data: {
                task_title: newTaskTitle,
                deadline: newDeadline ? new Date(newDeadline) : task.deadline
            }
        });
    });
};

// Soft delete a list 
const deleteList = (listName) => {
    return prisma.lists.updateMany({
        where: { list_name: listName, soft_delete: false },
        data: { soft_delete: true }
    });
};

// Soft delete a task from a list 
const deleteTask = (listName, taskTitle) => {
    return prisma.lists.findFirst({
        where: { list_name: listName, soft_delete: false }
    }).then((list) => {
        if (!list) {
            throw new Error(`List "${listName}" not found.`);
        }
        return prisma.tasks.updateMany({
            where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false },
            data: { soft_delete: true }
        });
    });
};

// Hash the password before saving the user 
const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

// Create a user with a hashed password 
const createUser = (username, password) => {
    return prisma.users.findUnique({
        where: { username }
    }).then((existingUser) => {
        if (existingUser) {
            throw new Error('Username is already taken.');
        }
        return hashPassword(password);
    }).then((hashedPassword) => {
        return prisma.users.create({
            data: {
                username: username,
                password: hashedPassword
            }
        });
    });
};

module.exports = {
    createListTask,
    completeTask,
    listAllLists,
    readListTasks,
    updateTask,
    deleteList,
    deleteTask,
    createUser
};
