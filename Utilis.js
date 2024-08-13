const fs = require("fs");

const createListTask = (list, task) => {
    if (!task || !task.trim()) {
        console.error("Task title cannot be empty.");
        return;
    }

    try {
        // Check if the JSON file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            fs.writeFileSync('datas.json', JSON.stringify({}));
        }

        // Read from the JSON file
        const todoBuffer = fs.readFileSync("datas.json");
        let todos = JSON.parse(todoBuffer.toString());

        // Check if the list exists
        if (!todos[list]) {
            todos[list] = { tasks: [] };
        }

        // Check for duplicates
        if (todos[list].tasks.some(existingTask => existingTask.title === task)) {
            console.log(`Task "${task}" already exists in list "${list}".`);
            return;
        }

        // Add the new task as an object with a completion status
        todos[list].tasks.push({ title: task, completed: false });

        // Write back to the JSON file
        const dataJSON = JSON.stringify(todos, null, 2);
        fs.writeFileSync("datas.json", dataJSON);
        console.log("Task added successfully");
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const listAllLists = () => {
    try {
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        const todoBuffer = fs.readFileSync("datas.json");
        const todos = JSON.parse(todoBuffer.toString());

        if (Object.keys(todos).length === 0) {
            console.log("No lists found.");
        } else {
            console.log("All lists:");
            for (let list in todos) {
                const tasks = todos[list].tasks.map(task => `${task.title} (Completed: ${task.completed})`).join(', ');
                console.log(`List: ${list}, Tasks: ${tasks}`);
            }
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const readListTasks = (list) => {
    try {
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        const todoBuffer = fs.readFileSync("datas.json");
        const todos = JSON.parse(todoBuffer.toString());

        if (todos[list]) {
            const tasks = todos[list].tasks.map(task => `${task.title} (Completed: ${task.completed})`).join(', ');
            console.log(`Tasks for list "${list}": ${tasks}`);
        } else {
            console.log(`List "${list}" not found.`);
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const updateListName = (oldList, newList) => {
    try {
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        const todoBuffer = fs.readFileSync("datas.json");
        let todos = JSON.parse(todoBuffer.toString());

        if (todos[oldList]) {
            todos[newList] = todos[oldList]; // Rename the list
            delete todos[oldList]; // Remove the old list name

            const dataJSON = JSON.stringify(todos, null, 2);
            fs.writeFileSync("datas.json", dataJSON);
            console.log(`List name "${oldList}" updated to "${newList}"`);
        } else {
            console.log(`List "${oldList}" not found.`);
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const updateTask = (list, oldTask, newTask) => {
    if (!oldTask || !oldTask.trim() || !newTask || !newTask.trim()) {
        console.error("Task titles cannot be empty.");
        return;
    }

    try {
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        const todoBuffer = fs.readFileSync("datas.json");
        let todos = JSON.parse(todoBuffer.toString());

        if (todos[list]) {
            const taskIndex = todos[list].tasks.findIndex(task => task.title === oldTask);
            if (taskIndex !== -1) {
                todos[list].tasks[taskIndex].title = newTask; // Update the task title
                const dataJSON = JSON.stringify(todos, null, 2);
                fs.writeFileSync("datas.json", dataJSON);
                console.log(`Task "${oldTask}" updated to "${newTask}" in list "${list}".`);
            } else {
                console.log(`Task "${oldTask}" not found in list "${list}".`);
            }
        } else {
            console.log(`List "${list}" not found.`);
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const deleteList = (list) => {
    try {
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        const todoBuffer = fs.readFileSync("datas.json");
        let todos = JSON.parse(todoBuffer.toString());

        if (todos[list]) {
            delete todos[list];

            const dataJSON = JSON.stringify(todos, null, 2);
            fs.writeFileSync("datas.json", dataJSON);
            console.log(`List "${list}" deleted successfully.`);
        } else {
            console.log(`List "${list}" not found.`);
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const deleteTask = (list, taskToDelete) => {
    if (!taskToDelete || !taskToDelete.trim()) {
        console.error("Task title cannot be empty.");
        return;
    }

    try {
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        const todoBuffer = fs.readFileSync("datas.json");
        let todos = JSON.parse(todoBuffer.toString());

        if (todos[list]) {
            const taskIndex = todos[list].tasks.findIndex(task => task.title === taskToDelete);
            if (taskIndex !== -1) {
                todos[list].tasks.splice(taskIndex, 1); // Remove the task
                const dataJSON = JSON.stringify(todos, null, 2);
                fs.writeFileSync("datas.json", dataJSON);
                console.log(`Task "${taskToDelete}" deleted successfully from list "${list}".`);
            } else {
                console.log(`Task "${taskToDelete}" not found in list "${list}".`);
            }
        } else {
            console.log(`List "${list}" not found.`);
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

// New function to complete a task
const completeTask = (list, taskToComplete) => {
    if (!taskToComplete || !taskToComplete.trim()) {
        console.error("Task title cannot be empty.");
        return;
    }

    try {
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        const todoBuffer = fs.readFileSync("datas.json");
        let todos = JSON.parse(todoBuffer.toString());

        if (todos[list]) {
            const task = todos[list].tasks.find(task => task.title === taskToComplete);
            if (task) {
                task.completed = true; // Mark the task as completed
                const dataJSON = JSON.stringify(todos, null, 2);
                fs.writeFileSync("datas.json", dataJSON);
                console.log(`Task "${taskToComplete}" marked as completed in list "${list}".`);
            } else {
                console.log(`Task "${taskToComplete}" not found in list "${list}".`);
            }
        } else {
            console.log(`List "${list}" not found.`);
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

module.exports = {
    createListTask,
    listAllLists,
    readListTasks,
    updateListName,
    updateTask,
    deleteList,
    deleteTask,
    completeTask, // Exporting the new function
};
