const express = require('express');
const listCRUD = require('../../../../services/list/listCRUD');  // Import the correct service
const authenticateToken = require('../../../middlewares/authMiddleware');  // Import the auth middleware

const router = express.Router();

// Route to get all lists for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const lists = await listCRUD.listAllLists(req.user.user_id);  // Get lists for the authenticated user
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new list for the authenticated user
router.post('/add', authenticateToken, async (req, res) => {
    const { listName } = req.body;
    const user_id = req.user.user_id;

    try {
        await listCRUD.createList(listName, user_id);  // Create a new list
        res.status(201).json({ message: 'List created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Soft delete a list by its ID for the authenticated user
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;  // Get list_id from the URL
    const user_id = req.user.user_id;  // Get user_id from the authentication token

    try {
        const result = await listCRUD.deleteList(id, user_id);  // Call deleteList from listCRUD

        if (result.count === 0) {
            return res.status(404).json({ message: "List not found or already deleted." });
        }

        res.status(204).send();  // Success: No Content response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
