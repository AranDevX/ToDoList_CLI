const express = require('express');
const router = express.Router();

// Import route handlers
const userRoutes = require('./user/authRout');  // User routes
const listRoutes = require('./list/listRout');  // List routes
const taskRoutes = require('./task/taskRout');  // Task routes

// Mount the user routes under /user
console.log('Mounting /api/v1/user routes...');
router.use('/user', userRoutes);

// Mount the list routes under /lists
console.log('Mounting /api/v1/lists routes...');
router.use('/lists', listRoutes);

// Mount the task routes under /tasks
console.log('Mounting /api/v1/tasks routes...');
router.use('/tasks', taskRoutes);

module.exports = router;
