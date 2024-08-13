const express = require("express");
const bodyParser = require("body-parser");
const Utilis = require("./Utilis");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // Parse JSON bodies

// Endpoint to add a task
app.post("/tasks", (req, res) => {
    const { list, task } = req.body;
    if (!list || !task) {
        return res.status(400).json({ message: "List and task are required." });
    }
    Utilis.createListTask(list, task);
    res.status(201).json({ message: "Task added successfully." });
});

// Endpoint to list all lists
app.get("/lists", (req, res) => {
    const todos = Utilis.listAllLists();
    res.status(200).json(todos);
});

// Endpoint to read tasks from a specified list
app.get("/lists/:list", (req, res) => {
    const { list } = req.params;
    const tasks = Utilis.readListTasks(list);
    res.status(200).json(tasks);
});

// Endpoint to update a list name
app.put("/lists/:oldName", (req, res) => {
    const { oldName } = req.params;
    const { newName } = req.body;
    if (!newName) {
        return res.status(400).json({ message: "New name is required." });
    }
    Utilis.updateListName(oldName, newName);
    res.status(200).json({ message: "List name updated successfully." });
});

// Endpoint to update a task
app.put("/lists/:list/tasks", (req, res) => {
    const { list } = req.params;
    const { oldTask, newTask } = req.body;
    if (!oldTask || !newTask) {
        return res.status(400).json({ message: "Old task and new task are required." });
    }
    Utilis.updateTask(list, oldTask, newTask);
    res.status(200).json({ message: "Task updated successfully." });
});

// Endpoint to delete a specified list
app.delete("/lists/:list", (req, res) => {
    const { list } = req.params;
    Utilis.deleteList(list);
    res.status(200).json({ message: "List deleted successfully." });
});

// Endpoint to delete a task from a specified list
app.delete("/lists/:list/tasks", (req, res) => {
    const { list } = req.params;
    const { task } = req.body;
    Utilis.deleteTask(list, task);
    res.status(200).json({ message: "Task deleted successfully." });
});

// Endpoint to mark a task as completed
app.put("/lists/:list/tasks/complete", (req, res) => {
    const { list } = req.params;
    const { task } = req.body;
    Utilis.completeTask(list, task);
    res.status(200).json({ message: "Task marked as completed." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
