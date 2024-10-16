// /src/api/routes/V1/index.js
const express = require('express');
const router = express.Router();

// Import route handlers
const userRoutes = require('./user/authRout');  // Path to your auth routes

// Mount the user routes under /user
console.log('Mounting /api/v1/user routes...');
router.use('/user', userRoutes);

module.exports = router;
