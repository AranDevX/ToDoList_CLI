const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Function to retrieve lists from the JSON file
const getAllLists = () => {
    try {
        const dataBuffer = fs.readFileSync('datas.json');
        const dataJSON = dataBuffer.toString();
        const todos = JSON.parse(dataJSON);
        return todos;
    } catch (e) {
        return {}; // Return an empty object if the file doesn't exist or there's an error
    }
};

// Function to save lists to the JSON file
const saveAllLists = (todos) => {
    const dataJSON = JSON.stringify(todos, null, 2);
    fs.writeFileSync('datas.json', dataJSON);
};

// Define the GET route for /lists
app.get('/lists', (req, res) => {
    try {
        const lists = getAllLists();
        res.json(lists); // Send the lists as a JSON response
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the POST route to add a new task to a list
app.post('/lists', (req, res) => {
    try {
        const { list, task } = req.body;
        let todos = getAllLists();

        if (!todos[list]) {
            todos[list] = { tasks: [] };
        }

        // Add the new task with a completed status of false
        todos[list].tasks.push({ title: task, completed: false });
        saveAllLists(todos);

        res.status(201).json({ message: "Task added successfully", list: todos[list] });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the PUT route to update a list name
app.put('/lists/:oldListName', (req, res) => {
    try {
        const oldListName = req.params.oldListName;
        const { newListName } = req.body;
        let todos = getAllLists();

        if (todos[oldListName]) {
            todos[newListName] = todos[oldListName];
            delete todos[oldListName];
            saveAllLists(todos);
            res.json({ message: `List name updated from "${oldListName}" to "${newListName}"` });
        } else {
            res.status(404).json({ message: `List "${oldListName}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the PUT route to update a task in a list
app.put('/lists/:list/tasks', (req, res) => {
    try {
        const list = req.params.list;
        const { oldTask, newTask } = req.body;
        let todos = getAllLists();

        if (todos[list]) {
            const taskIndex = todos[list].tasks.findIndex(task => task.title === oldTask);
            if (taskIndex !== -1) {
                todos[list].tasks[taskIndex].title = newTask;
                saveAllLists(todos);
                res.json({ message: `Task updated from "${oldTask}" to "${newTask}"` });
            } else {
                res.status(404).json({ message: `Task "${oldTask}" not found in list "${list}".` });
            }
        } else {
            res.status(404).json({ message: `List "${list}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the DELETE route to delete a list
app.delete('/lists/:list', (req, res) => {
    try {
        const list = req.params.list;
        let todos = getAllLists();

        if (todos[list]) {
            delete todos[list];
            saveAllLists(todos);
            res.json({ message: `List "${list}" deleted successfully.` });
        } else {
            res.status(404).json({ message: `List "${list}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the DELETE route to delete a task from a list
app.delete('/lists/:list/tasks', (req, res) => {
    try {
        const list = req.params.list;
        const { task } = req.body;
        let todos = getAllLists();

        if (todos[list]) {
            const taskIndex = todos[list].tasks.findIndex(task => task.title === task);
            if (taskIndex !== -1) {
                todos[list].tasks.splice(taskIndex, 1);
                saveAllLists(todos);
                res.json({ message: `Task "${task}" deleted successfully from list "${list}".` });
            } else {
                res.status(404).json({ message: `Task "${task}" not found in list "${list}".` });
            }
        } else {
            res.status(404).json({ message: `List "${list}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the PUT route to mark a task as completed
app.put('/lists/:list/tasks/complete', (req, res) => {
    try {
        const list = req.params.list;
        const { task } = req.body;
        let todos = getAllLists();

        if (todos[list]) {
            const taskIndex = todos[list].tasks.findIndex(t => t.title === task);
            if (taskIndex !== -1) {
                todos[list].tasks[taskIndex].completed = true;
                saveAllLists(todos);
                res.json({ message: `Task "${task}" marked as completed in list "${list}".` });
            } else {
                res.status(404).json({ message: `Task "${task}" not found in list "${list}".` });
            }
        } else {
            res.status(404).json({ message: `List "${list}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
