const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new task
const createTask = async (taskTitle, deadline, listId, user_id) => {
    if (!taskTitle.trim()) {
        throw new Error('Task title cannot be empty.');
    }

    // Ensure listId is an integer
    const listIdInt = parseInt(listId, 10);

    const list = await prisma.lists.findFirst({
        where: { list_id: listIdInt, user_id, soft_delete: false }
    });

    if (!list) {
        throw new Error('List not found.');
    }

    const task = await prisma.tasks.create({
        data: {
            task_title: taskTitle,
            list_id: listIdInt,  // Correct reference to the list
            deadline: deadline ? new Date(deadline) : null,
            completed: false,
            soft_delete: false
        }
    });

    console.log('Task created successfully:', task);  // Log the created task details

    return task;
};

// Complete the Task
const completeTask = async (listId, taskId, user_id) => {
    // Ensure listId and taskId are integers
    const listIdInt = parseInt(listId, 10);
    const taskIdInt = parseInt(taskId, 10);

    console.log(`Completing task with taskId: ${taskIdInt} and listId: ${listIdInt} for user: ${user_id}`);

    // Find the task to ensure it exists and belongs to the correct list
    const task = await prisma.tasks.findFirst({
        where: { task_id: taskIdInt, list_id: listIdInt, soft_delete: false }
    });

    if (!task) {
        console.error(`Task with taskId: ${taskIdInt} and listId: ${listIdInt} not found or is soft deleted.`);
        throw new Error('Task not found.');
    }

    console.log('Task found:', task);

    // Mark the task as completed
    return await prisma.tasks.update({
        where: { task_id: task.task_id },
        data: { completed: true }
    });
};

// Update a task
const updateTask = async (listId, taskId, newTaskTitle, newDeadline = null, user_id) => {
    // Ensure listId and taskId are integers
    const listIdInt = parseInt(listId, 10);
    const taskIdInt = parseInt(taskId, 10);  // Convert taskId to an integer

    const list = await prisma.lists.findFirst({
        where: { list_id: listIdInt, user_id, soft_delete: false }
    });

    if (!list) {
        throw new Error('List not found.');
    }

    const task = await prisma.tasks.findFirst({
        where: { task_id: taskIdInt, list_id: list.list_id, soft_delete: false }  // Use taskIdInt here
    });

    if (!task) {
        throw new Error('Task not found.');
    }

    return await prisma.tasks.update({
        where: { task_id: taskIdInt },  // Use taskIdInt here
        data: {
            task_title: newTaskTitle,
            deadline: newDeadline ? new Date(newDeadline) : task.deadline  // Use existing deadline if not provided
        }
    });
};


// Soft delete a task
const deleteTask = async (listId, taskId, user_id) => {
    const listIdInt = parseInt(listId, 10);
    const taskIdInt = parseInt(taskId, 10);

    console.log(`Deleting task with taskId: ${taskIdInt} and listId: ${listIdInt}`);

    const task = await prisma.tasks.findFirst({
        where: { task_id: taskIdInt, list_id: listIdInt, soft_delete: false }
    });

    if (!task) {
        console.error('Task not found.');
        throw new Error('Task not found.');
    }

    return await prisma.tasks.update({
        where: { task_id: taskIdInt },
        data: { soft_delete: true }
    });
};


module.exports = {
    createTask,
    completeTask,
    updateTask,
    deleteTask,
};
