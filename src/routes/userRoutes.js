// src/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Route to register a new user (Promise-based)
router.post('/register', userController.registerUser);

module.exports = router;
