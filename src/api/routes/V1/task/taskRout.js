const express = require('express');
const taskCRUD = require('../../../../services/task/taskCRUD');
const authenticateToken = require('../../../middlewares/authMiddleware');

const router = express.Router();

// Route to add a new task to a list
router.post('/:listId/tasks', authenticateToken, async (req, res) => {
    const { taskTitle, deadline } = req.body;
    const { listId } = req.params;
    const user_id = req.user.user_id;

    try {
        await taskCRUD.createTask(taskTitle, deadline, listId, user_id);
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to complete a task
router.patch('/:listId/tasks/:taskId/complete', authenticateToken, async (req, res) => {
    const { listId, taskId } = req.params;
    const user_id = req.user.user_id;

    try {
        await taskCRUD.completeTask(listId, taskId, user_id);
        res.json({ message: 'Task marked as complete' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a task
router.put('/:listId/tasks/:taskId', authenticateToken, async (req, res) => {
    const { taskTitle, deadline } = req.body;
    const { listId, taskId } = req.params;
    const user_id = req.user.user_id;

    try {
        await taskCRUD.updateTask(listId, taskId, taskTitle, deadline, user_id);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a task
router.delete('/:listId/tasks/:taskId', authenticateToken, async (req, res) => {
    const { listId, taskId } = req.params;
    const user_id = req.user.user_id;

    try {
        await taskCRUD.deleteTask(listId, taskId, user_id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
