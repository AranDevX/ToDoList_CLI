// src/routes/listRoutes.js
const express = require('express');
const listController = require('../controllers/listController');

const router = express.Router();

// Route to get all lists
router.get('/', listController.listAllLists);

// Route to read tasks from a specific list
router.get('/:list/tasks', listController.readListTasks);

// Route to add a new task to a list
router.post('/', listController.createListTask);

// Route to mark a task as complete
router.patch('/:list/tasks/complete', listController.completeTask);

// Route to update a task in a list
router.put('/:list/tasks', listController.updateTask);

// Route to delete a list
router.delete('/:list', listController.deleteList);

// Route to delete a task from a list
router.delete('/:list/tasks', listController.deleteTask);

module.exports = router;
