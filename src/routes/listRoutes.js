// src/routes/listRoutes.js
const express = require('express');
const listController = require('../controllers/listController');

const router = express.Router();

// Route to get all lists
router.get('/', listController.getLists);

// Route to add a new task to a list
router.post('/', listController.addTaskToList);

// Route to mark a task as complete
router.patch('/:list/tasks/complete', listController.completeTask);

// Route to update a task
router.put('/:list/tasks', listController.updateTask);

// Route to delete a list
router.delete('/:list', listController.deleteList);

// Route to delete a task
router.delete('/:list/tasks', listController.deleteTask);

module.exports = router;
