// src/controllers/userController.js

const listService = require('../services/listService');

// Controller to handle user registration 
const registerUser = (req, res) => {
    const { username, password } = req.body;

    listService.createUser(username, password)
        .then((newUser) => {
            res.status(201).json({ message: 'User created successfully', user: newUser });
        })
        .catch((error) => {
            res.status(500).json({ message: error.message });
        });
};

module.exports = {
    registerUser,
};
