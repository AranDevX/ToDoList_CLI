// src/controllers/listController.js
const listService = require('../services/listService');

// Controller to get all lists
const getLists = async (req, res) => {
    try {
        const lists = await listService.getAllLists();
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to add a new task to a list
const addTaskToList = async (req, res) => {
    const { list, task, deadline } = req.body;
    try {
        await listService.createListTask(list, task, deadline);
        res.status(201).json({ message: "Task added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Other controllers like completeTask, updateTask, deleteTask, and deleteList follow the same pattern

module.exports = {
    getLists,
    addTaskToList,
    completeTask,
    updateTask,
    deleteList,
    deleteTask
};
