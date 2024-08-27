const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(express.json());

// Define the GET route for /lists
app.get('/lists', async (req, res) => {
    try {
        const lists = await prisma.lists.findMany({
            where: { soft_delete: false }
        });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the POST route to add a new task to a list
app.post('/lists', async (req, res) => {
    try {
        const { list, task, deadline, user_id } = req.body;
        
        const defaultUserId = 1; // Replace with the actual user_id of your default user
        const userIdToUse = user_id || defaultUserId;

        // Find or create the list
        let existingList = await prisma.lists.findFirst({
            where: { list_name: list, soft_delete: false }
        });

        if (!existingList) {
            existingList = await prisma.lists.create({
                data: {
                    list_name: list,
                    user_id: userIdToUse
                }
            });
        }

        // Add the task to the list
        await prisma.tasks.create({
            data: {
                task_title: task,
                completed: false,
                list_id: existingList.list_id,
                deadline: deadline ? new Date(deadline) : null,
                soft_delete: false
            }
        });

        res.status(201).json({ message: "Task added successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the PUT route to update a task in a list (with deadline)
app.put('/lists/:list/tasks', async (req, res) => {
    try {
        const listName = req.params.list;
        const { oldTask, newTask, deadline } = req.body;

        const list = await prisma.lists.findFirst({
            where: { list_name: listName, soft_delete: false }
        });

        if (list) {
            const task = await prisma.tasks.findFirst({
                where: { task_title: oldTask, list_id: list.list_id, soft_delete: false }
            });

            if (task) {
                await prisma.tasks.update({
                    where: { task_id: task.task_id },
                    data: {
                        task_title: newTask,
                        deadline: deadline ? new Date(deadline) : null
                    }
                });
                res.json({ message: `Task updated from "${oldTask}" to "${newTask}" with deadline "${deadline}"` });
            } else {
                res.status(404).json({ message: `Task "${oldTask}" not found in list "${listName}".` });
            }
        } else {
            res.status(404).json({ message: `List "${listName}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the DELETE route to soft delete a list
app.delete('/lists/:list', async (req, res) => {
    try {
        const listName = req.params.list;

        const list = await prisma.lists.updateMany({
            where: { list_name: listName, soft_delete: false },
            data: { soft_delete: true }
        });

        if (list.count > 0) {
            res.json({ message: `List "${listName}" deleted successfully.` });
        } else {
            res.status(404).json({ message: `List "${listName}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the DELETE route to soft delete a task from a list
app.delete('/lists/:list/tasks', async (req, res) => {
    try {
        const listName = req.params.list;
        const { task } = req.body;

        const list = await prisma.lists.findFirst({
            where: { list_name: listName, soft_delete: false }
        });

        if (list) {
            const taskRecord = await prisma.tasks.updateMany({
                where: { task_title: task, list_id: list.list_id, soft_delete: false },
                data: { soft_delete: true }
            });

            if (taskRecord.count > 0) {
                res.json({ message: `Task "${task}" deleted successfully from list "${listName}".` });
            } else {
                res.status(404).json({ message: `Task "${task}" not found in list "${listName}".` });
            }
        } else {
            res.status(404).json({ message: `List "${listName}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
