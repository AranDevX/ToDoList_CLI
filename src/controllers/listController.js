// src/controllers/listController.js

const listService = require('../services/listService');

// Controller to get all lists
const listAllLists = async (req, res) => {
    try {
        const lists = await listService.listAllLists();
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to read tasks from a specific list
const readListTasks = async (req, res) => {
    const listName = req.params.list;
    try {
        const tasks = await listService.readListTasks(listName);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to add a task to a list
const createListTask = async (req, res) => {
    const { list, task, deadline } = req.body;
    try {
        await listService.createListTask(list, task, deadline);
        res.status(201).json({ message: "Task added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to mark a task as completed
const completeTask = async (req, res) => {
    const listName = req.params.list;
    const { task } = req.body;
    try {
        await listService.completeTask(listName, task);
        res.json({ message: `Task "${task}" marked as completed in list "${listName}".` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to update a task in a list
const updateTask = async (req, res) => {
    const { oldTask, newTask, deadline } = req.body;
    const listName = req.params.list;
    try {
        await listService.updateTask(listName, oldTask, newTask, deadline);
        res.json({ message: `Task updated successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to soft delete a list
const deleteList = async (req, res) => {
    const listName = req.params.list;
    try {
        await listService.deleteList(listName);
        res.json({ message: `List "${listName}" deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to soft delete a task from a list
const deleteTask = async (req, res) => {
    const listName = req.params.list;
    const { task } = req.body;
    try {
        await listService.deleteTask(listName, task);
        res.json({ message: `Task "${task}" deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
