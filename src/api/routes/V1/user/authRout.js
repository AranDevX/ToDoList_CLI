const express = require('express');
const userService = require('../../../../services/user/userService');

const router = express.Router();

// Route to register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await userService.createUser(username, password);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
