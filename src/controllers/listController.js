// src/controllers/listController.js

const listService = require('../services/listService');

// Controller to get all lists 
const listAllLists = (req, res) => {
    listService.listAllLists()
        .then((lists) => res.json(lists))
        .catch((error) => res.status(500).json({ message: error.message }));
};

// Controller to read tasks from a specific list 
const readListTasks = (req, res) => {
    const listName = req.params.list;
    listService.readListTasks(listName)
        .then((tasks) => res.json(tasks))
        .catch((error) => res.status(500).json({ message: error.message }));
};

// Controller to add a task to a list 
const addTaskToList = (req, res) => {
    const { list, task, deadline } = req.body;
    listService.createListTask(list, task, deadline)
        .then(() => res.status(201).json({ message: "Task added successfully" }))
        .catch((error) => res.status(500).json({ message: error.message }));
};

// Controller to mark a task as completed 
const completeTask = (req, res) => {
    const listName = req.params.list;
    const { task } = req.body;
    listService.completeTask(listName, task)
        .then(() => res.json({ message: `Task "${task}" marked as completed.` }))
        .catch((error) => res.status(500).json({ message: error.message }));
};

// Controller to update a task in a list 
const updateTask = (req, res) => {
    const { oldTask, newTask, deadline } = req.body;
    const listName = req.params.list;
    listService.updateTask(listName, oldTask, newTask, deadline)
        .then(() => res.json({ message: "Task updated successfully" }))
        .catch((error) => res.status(500).json({ message: error.message }));
};

// Controller to delete a list 
const deleteList = (req, res) => {
    const listName = req.params.list;
    listService.deleteList(listName)
        .then(() => res.json({ message: `List "${listName}" deleted successfully.` }))
        .catch((error) => res.status(500).json({ message: error.message }));
};

// Controller to delete a task from a list 
const deleteTask = (req, res) => {
    const listName = req.params.list;
    const { task } = req.body;
    listService.deleteTask(listName, task)
        .then(() => res.json({ message: `Task "${task}" deleted successfully.` }))
        .catch((error) => res.status(500).json({ message: error.message }));
};

module.exports = {
    listAllLists,
    readListTasks,
    addTaskToList,
    completeTask,
    updateTask,
    deleteList,
    deleteTask
};
