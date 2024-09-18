const express = require('express');
const listCRUD = require('../../../../services/list/listCRUD');  // Adjust the path if necessary

const router = express.Router();

// Route to get all lists
router.get('/', async (req, res) => {
    console.log('GET /lists route hit');  // Logging for debugging
    try {
        const lists = await listCRUD.listAllLists();
        res.json(lists);
    } catch (error) {
        console.error('Error fetching lists:', error);  // Log the error
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new task in a list
router.post('/add', async (req, res) => {
    console.log('POST /add route hit');  // Logging for debugging
    const { listName, taskTitle, deadline } = req.body;
    try {
        console.log('Request body:', req.body);  // Log the request body
        await listCRUD.createListTask(listName, taskTitle, deadline);
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        console.error('Error adding task:', error);  // Log the error
        res.status(500).json({ message: error.message });
    }
});

// Route to complete a task in a list
router.patch('/:list/tasks/complete', async (req, res) => {
    console.log('PATCH /:list/tasks/complete route hit');  // Logging for debugging
    const { taskTitle } = req.body;
    const { list } = req.params;
    try {
        await listCRUD.completeTask(list, taskTitle);
        res.json({ message: `Task "${taskTitle}" marked as completed.` });
    } catch (error) {
        console.error('Error completing task:', error);  // Log the error
        res.status(500).json({ message: error.message });
    }
});

// Route to update a task in a list
router.put('/:list/tasks', async (req, res) => {
    console.log('PUT /:list/tasks route hit');  // Logging for debugging
    const { list } = req.params;
    const { oldTaskTitle, newTaskTitle, deadline } = req.body;
    try {
        await listCRUD.updateTask(list, oldTaskTitle, newTaskTitle, deadline);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);  // Log the error
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a task from a list
router.delete('/:list/tasks', async (req, res) => {
    console.log('DELETE /:list/tasks route hit');  // Logging for debugging
    const { list } = req.params;
    const { taskTitle } = req.body;
    try {
        await listCRUD.deleteTask(list, taskTitle);
        res.json({ message: `Task "${taskTitle}" deleted successfully.` });
    } catch (error) {
        console.error('Error deleting task:', error);  // Log the error
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a list
router.delete('/:list', async (req, res) => {
    console.log('DELETE /:list route hit');  // Logging for debugging
    const { list } = req.params;
    try {
        await listCRUD.deleteList(list);
        res.json({ message: `List "${list}" deleted successfully.` });
    } catch (error) {
        console.error('Error deleting list:', error);  // Log the error
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
