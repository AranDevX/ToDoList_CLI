const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Helper functions to get and save data
const getData = () => {
    try {
        const dataBuffer = fs.readFileSync('datas.json');
        return JSON.parse(dataBuffer.toString());
    } catch (e) {
        return []; // Return an empty array if the file doesn't exist or there's an error
    }
};

const saveData = (data) => {
    const dataJSON = JSON.stringify(data, null, 2);
    fs.writeFileSync('datas.json', dataJSON);
};

// Define the GET route for /lists
app.get('/lists', (req, res) => {
    try {
        const data = getData();
        res.json(data); // Send the lists as a JSON response
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the POST route to add a new task to a list
app.post('/lists', (req, res) => {
    try {
        const { list, task } = req.body;
        let data = getData();

        // Find the list, or create a new one if it doesn't exist
        let listObj = data.find(l => l.listName === list);
        if (!listObj) {
            listObj = { listName: list, tasks: [] };
            data.push(listObj);
        }

        // Add the task to the list
        listObj.tasks.push({ title: task, completed: false });

        // Save the updated data back to the file
        saveData(data);

        res.status(201).json({ message: "Task added successfully", list: listObj });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the PUT route to update a task in a list
app.put('/lists/:list/tasks', (req, res) => {
    try {
        const listName = req.params.list;
        const { oldTask, newTask } = req.body;
        let data = getData();

        let listObj = data.find(l => l.listName === listName);

        if (listObj) {
            const task = listObj.tasks.find(task => task.title === oldTask);
            if (task) {
                task.title = newTask; // Update task title
                saveData(data);
                res.json({ message: `Task updated from "${oldTask}" to "${newTask}"` });
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

// Define the DELETE route to delete a list
app.delete('/lists/:list', (req, res) => {
    try {
        const listName = req.params.list;
        let data = getData();

        const initialLength = data.length;
        data = data.filter(list => list.listName !== listName);

        if (data.length < initialLength) {
            saveData(data);
            res.json({ message: `List "${listName}" deleted successfully.` });
        } else {
            res.status(404).json({ message: `List "${listName}" not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Define the DELETE route to delete a task from a list
app.delete('/lists/:list/tasks', (req, res) => {
    try {
        const listName = req.params.list;
        const { task } = req.body;
        let data = getData();

        let listObj = data.find(l => l.listName === listName);

        if (listObj) {
            const initialLength = listObj.tasks.length;
            listObj.tasks = listObj.tasks.filter(t => t.title !== task);

            if (listObj.tasks.length < initialLength) {
                saveData(data);
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
