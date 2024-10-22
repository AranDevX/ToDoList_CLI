// /src/api/routes/V1/list/listRout.js
const express = require('express');
const listCRUD = require('../../../../services/list/listCRUD');
const taskRoutes = require('../task/taskRout');  // Import task routes
const authenticateToken = require('../../../middlewares/authMiddleware');

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

    if (!listName || listName.trim() === '') {
        return res.status(400).json({ message: 'List name cannot be empty' });
    }

    try {
        await listCRUD.createList(listName, user_id);
        res.status(201).json({ message: 'List created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mount task routes under /lists/:listId/tasks
router.use('/:listId/tasks', taskRoutes);  // Ensure tasks are nested under lists

// Soft delete a list by its ID for the authenticated user
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        const result = await listCRUD.deleteList(id, user_id);

        if (result.count === 0) {
            return res.status(404).json({ message: "List not found or already deleted." });
        }

        res.status(204).send();  // Success: No Content response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
