const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// Set up the PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// Helper function to query the database with logging
const queryDatabase = async (query, params) => {
    try {
        console.log('Executing query:', query, params);
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Define the GET route for /lists
app.get('/lists', async (req, res) => {
    try {
        const lists = await queryDatabase('SELECT * FROM public.lists WHERE soft_delete = false', []);
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the POST route to add a new task to a list
app.post('/lists', async (req, res) => {
    try {
        const { list, task, deadline, user_id } = req.body;

        // Set a default user ID if no user ID is provided
        const defaultUserId = 1; // Replace with the actual user_id of your default user
        const userIdToUse = user_id || defaultUserId;

        // Find the list or create a new one if it doesn't exist
        const listResult = await queryDatabase('SELECT * FROM public.lists WHERE list_name = $1 AND soft_delete = false', [list]);

        let listId;
        if (listResult.length === 0) {
            const newList = await queryDatabase(
                'INSERT INTO public.lists (list_name, user_id) VALUES ($1, $2) RETURNING *',
                [list, userIdToUse]
            );
            listId = newList[0].list_id;
        } else {
            listId = listResult[0].list_id;
        }

        // Add the task to the list
        await queryDatabase(
            'INSERT INTO public.tasks (task_title, completed, list_id, deadline, soft_delete) VALUES ($1, $2, $3, $4, $5)',
            [task, false, listId, deadline, false]
        );

        res.status(201).json({ message: "Task added successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the PUT route to update a task in a list (with deadline)
app.put('/lists/:list/tasks', async (req, res) => {
    try {
        const listName = req.params.list;
        const { oldTask, newTask, deadline } = req.body;

        const listResult = await queryDatabase('SELECT * FROM public.lists WHERE list_name = $1 AND soft_delete = false', [listName]);

        if (listResult.length > 0) {
            const listId = listResult[0].list_id;
            const taskResult = await queryDatabase('SELECT * FROM public.tasks WHERE task_title = $1 AND list_id = $2 AND soft_delete = false', [oldTask, listId]);

            if (taskResult.length > 0) {
                await queryDatabase(
                    'UPDATE public.tasks SET task_title = $1, deadline = $2 WHERE task_id = $3',
                    [newTask, deadline, taskResult[0].task_id]
                );
                res.json({ message: `Task updated from "${oldTask}" to "${newTask}" with deadline "${deadline}"` });
            } else {
                res.status(404).json({ message: `Task "${oldTask}" not found in list "${listName}".` });
            }
        } else {
            res.status(404).json({ message: `List "${listName}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the DELETE route to delete a list (soft delete)
app.delete('/lists/:list', async (req, res) => {
    try {
        const listName = req.params.list;

        const listResult = await queryDatabase('UPDATE public.lists SET soft_delete = true WHERE list_name = $1 RETURNING *', [listName]);

        if (listResult.length > 0) {
            res.json({ message: `List "${listName}" deleted successfully.` });
        } else {
            res.status(404).json({ message: `List "${listName}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the DELETE route to delete a task from a list (soft delete)
app.delete('/lists/:list/tasks', async (req, res) => {
    try {
        const listName = req.params.list;
        const { task } = req.body;

        const listResult = await queryDatabase('SELECT * FROM public.lists WHERE list_name = $1 AND soft_delete = false', [listName]);

        if (listResult.length > 0) {
            const listId = listResult[0].list_id;
            const taskResult = await queryDatabase('UPDATE public.tasks SET soft_delete = true WHERE task_title = $1 AND list_id = $2 RETURNING *', [task, listId]);

            if (taskResult.length > 0) {
                res.json({ message: `Task "${task}" deleted successfully from list "${listName}".` });
            } else {
                res.status(404).json({ message: `Task "${task}" not found in list "${listName}".` });
            }
        } else {
            res.status(404).json({ message: `List "${listName}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
