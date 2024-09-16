const express = require('express');
const listCRUD = require('../../../services/list/listCRUD'); // Import CRUD functions

const router = express.Router();

// Route to get all lists
router.get('/', async (req, res) => {
    try {
        const lists = await listCRUD.listAllLists();
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new task in a list
router.post('/add', async (req, res) => {
    const { listName, taskTitle, deadline } = req.body;
    try {
        await listCRUD.createListTask(listName, taskTitle, deadline);
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to complete a task in a list
router.patch('/:list/tasks/complete', async (req, res) => {
    const { taskTitle } = req.body;
    const { list } = req.params;
    try {
        await listCRUD.completeTask(list, taskTitle);
        res.json({ message: `Task "${taskTitle}" marked as completed.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a task in a list
router.put('/:list/tasks', async (req, res) => {
    const { list } = req.params;
    const { oldTaskTitle, newTaskTitle, deadline } = req.body;
    try {
        await listCRUD.updateTask(list, oldTaskTitle, newTaskTitle, deadline);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a task from a list
router.delete('/:list/tasks', async (req, res) => {
    const { list } = req.params;
    const { taskTitle } = req.body;
    try {
        await listCRUD.deleteTask(list, taskTitle);
        res.json({ message: `Task "${taskTitle}" deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a list
router.delete('/:list', async (req, res) => {
    const { list } = req.params;
    try {
        await listCRUD.deleteList(list);
        res.json({ message: `List "${list}" deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
