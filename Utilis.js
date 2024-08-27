const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to get all lists along with tasks
const getData = async () => {
    try {
        return await prisma.lists.findMany({
            where: { soft_delete: false },
            include: { tasks: true }
        });
    } catch (error) {
        console.error("Error retrieving data:", error.message);
        return [];
    }
};

// Function to create a new list and task
const createListTask = async (listName, taskTitle, deadline = null) => {
    if (!taskTitle || !taskTitle.trim()) {
        console.error("Task title cannot be empty.");
        return;
    }

    try {
        let list = await prisma.lists.findFirst({
            where: { list_name: listName, soft_delete: false }
        });

        // If list doesn't exist, create it
        if (!list) {
            list = await prisma.lists.create({
                data: { list_name: listName }
            });
        }

        // Check if the task already exists in the list
        const taskExists = await prisma.tasks.findFirst({
            where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false }
        });

        if (taskExists) {
            console.log(`Task "${taskTitle}" already exists in list "${listName}".`);
            return;
        }

        // Add the task to the list
        await prisma.tasks.create({
            data: {
                task_title: taskTitle,
                completed: false,
                list_id: list.list_id,
                deadline: deadline ? new Date(deadline) : null,
                soft_delete: false
            }
        });

        console.log("Task added successfully");
    } catch (error) {
        console.error("Error creating task:", error.message);
    }
};

// Function to mark a task as completed
const completeTask = async (listName, taskTitle) => {
    try {
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
                console.log(`Task "${taskTitle}" marked as completed.`);
            } else {
                console.log(`Task "${taskTitle}" not found in list "${listName}".`);
            }
        } else {
            console.log(`List "${listName}" notfound.`);
        }
    } catch (error) {
        console.error("Error marking task as completed:", error.message);
    }
};

// Function to list all lists
const listAllLists = async () => {
    try {
        const data = await getData();
        if (data.length === 0) {
            console.log("No lists found.");
        } else {
            console.log("All lists:");
            data.forEach(list => {
                const tasks = list.tasks.map(task => `${task.task_title} (Completed: ${task.completed}, Deadline: ${task.deadline || 'No deadline'})`).join(', ');
                console.log(`List: ${list.list_name}, Tasks: ${tasks}`);
            });
        }
    } catch (error) {
        console.error("Error listing all lists:", error.message);
    }
};

// Function to read tasks from a specific list
const readListTasks = async (listName) => {
    try {
        const list = await prisma.lists.findFirst({
            where: { list_name: listName, soft_delete: false },
            include: { tasks: true }
        });

        if (list) {
            const tasks = list.tasks.map(task => `${task.task_title} (Completed: ${task.completed}, Deadline: ${task.deadline || 'No deadline'})`).join(', ');
            console.log(`Tasks for list "${listName}": ${tasks}`);
        } else {
            console.log(`List "${listName}" not found.`);
        }
    } catch (error) {
        console.error("Error reading list tasks:", error.message);
    }
};

// Function to update a task in a list
const updateTask = async (listName, oldTaskTitle, newTaskTitle, newDeadline = null) => {
    try {
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
                console.log(`Task "${oldTaskTitle}" updated to "${newTaskTitle}" with deadline "${newDeadline}".`);
            } else {
                console.log(`Task "${oldTaskTitle}" not found in list "${listName}".`);
            }
        } else {
            console.log(`List "${listName}" not found.`);
        }
    } catch (error) {
        console.error("Error updating task:", error.message);
    }
};

// Function to delete a list (soft delete)
const deleteList = async (listName) => {
    try {
        await prisma.lists.updateMany({
            where: { list_name: listName, soft_delete: false },
            data: { soft_delete: true }
        });
        console.log(`List "${listName}" deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting list "${listName}":`, error.message);
    }
};

// Function to delete a task from a list (soft delete)
const deleteTask = async (listName, taskTitle) => {
    try {
        const list = await prisma.lists.findFirst({
            where: { list_name: listName, soft_delete: false }
        });

        if (list) {
            await prisma.tasks.updateMany({
                where: { task_title: taskTitle, list_id: list.list_id, soft_delete: false },
                data: { soft_delete: true }
            });
            console.log(`Task "${taskTitle}" deleted successfully from list "${listName}".`);
        } else {
            console.log(`List "${listName}" not found.`);
        }
    } catch (error) {
        console.error(`Error deleting task "${taskTitle}" from list "${listName}":`, error.message);
    }
};

// Export the functions
module.exports = {
    createListTask,
    completeTask,
    listAllLists,
    readListTasks,
    updateTask,
    deleteList,
    deleteTask,
};
