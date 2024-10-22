const express = require('express');
const taskCRUD = require('../../../../services/task/taskCRUD');
const authenticateToken = require('../../../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');  // Import Prisma Client
const prisma = new PrismaClient();  // Initialize Prisma Client

const router = express.Router();

// Route to add a new task (listId passed in body)
router.post('/add', authenticateToken, async (req, res) => {
    const { taskTitle, deadline, listId } = req.body;
    const user_id = req.user.user_id;

    console.log(`POST request to /tasks/add`);
    console.log(`listId: ${listId}, taskTitle: ${taskTitle}, deadline: ${deadline}, user_id: ${user_id}`);

    if (!listId) {
        return res.status(400).json({ message: 'listId is required' });
    }

    try {
        await taskCRUD.createTask(taskTitle, deadline, listId, user_id);
        console.log('Task creation successful.');
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        console.error(`Error adding task: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

// Route to complete a task
router.patch('/:taskId/complete', authenticateToken, async (req, res) => {
    const { taskId } = req.params;
    const listId = req.body.listId;  // Ensure listId is passed correctly in the body or params
    const user_id = req.user.user_id;

    console.log(`PATCH request to complete task with taskId: ${taskId}, user_id: ${user_id}`);

    try {
        await taskCRUD.completeTask(listId, taskId, user_id);  // Ensure parameters are correct
        res.json({ message: 'Task marked as complete' });
    } catch (error) {
        console.error(`Error completing task: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});


// Route to update a task (listId passed in body)
router.put('/:taskId', authenticateToken, async (req, res) => {
    const { taskTitle, deadline, listId } = req.body;
    const { taskId } = req.params;
    const user_id = req.user.user_id;

    console.log(`PUT request to update task with taskId: ${taskId}, listId: ${listId}`);

    try {
        await taskCRUD.updateTask(listId, taskId, taskTitle, deadline, user_id);
        console.log('Task updated successfully.');
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error(`Error updating task: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a task
router.delete('/:taskId', authenticateToken, async (req, res) => {
    const { taskId } = req.params;
    const user_id = req.user.user_id;

    console.log(`DELETE request for taskId: ${taskId}, user_id: ${user_id}`);

    try {
        await taskCRUD.deleteTask(taskId, user_id);
        console.log('Task deleted successfully.');
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(`Error deleting task: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

// New Route to Get All Tasks for the Authenticated User
router.get('/all', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;

    console.log(`GET request to fetch all tasks for user_id: ${user_id}`);

    try {
        const tasks = await prisma.tasks.findMany({
            where: {
                lists: {
                    user_id: user_id,
                    soft_delete: false,
                },
                soft_delete: false
            }
        });

        if (!tasks.length) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        res.json(tasks);
    } catch (error) {
        console.error(`Error fetching tasks: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
