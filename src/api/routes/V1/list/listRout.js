const express = require('express');
const listCRUD = require('../../../../services/list/listCRUD');
const authenticateToken = require('../../../middlewares/authMiddleware');

const router = express.Router();

// Route to get all lists
router.get('/', authenticateToken, async (req, res) => {
    try {
        const lists = await listCRUD.listAllLists(req.user.user_id);
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new list
router.post('/add', authenticateToken, async (req, res) => {
    const { listName } = req.body;
    const user_id = req.user.user_id;
    try {
        await listCRUD.createList(listName, user_id);
        res.status(201).json({ message: 'List created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a list
router.delete('/:listName', authenticateToken, async (req, res) => {
    const { listName } = req.params;
    const user_id = req.user.user_id;
    try {
        await listCRUD.deleteList(listName, user_id);
        res.json({ message: `List "${listName}" deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
