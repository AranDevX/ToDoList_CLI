const fs = require("fs");

const createListTask = (list, task) => {
    try {
        // Check if the JSON file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            // If it does not exist, create a new JSON file
            fs.writeFileSync('datas.json', JSON.stringify({}));
        }

        // Read from the JSON file
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Parse the data
        let todos = JSON.parse(todoBuffer.toString());
        console.log("Parsed todos:", todos);

        // Check if the list exists
        if (!todos[list]) {
            todos[list] = { tasks: [] }; // Create a new list if it doesn't exist
        }

        // Add the new task to the list
        todos[list].tasks.push(task);

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
        // Check if the JSON file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        // Read from the JSON file
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Parse the data
        const todos = JSON.parse(todoBuffer.toString());
        console.log("Parsed todos:", todos);

        // List all the lists
        if (Object.keys(todos).length === 0) {
            console.log("No lists found.");
        } else {
            console.log("All lists:");
            for (let list in todos) {
                console.log(`List: ${list}, Tasks: ${todos[list].tasks.join(', ')}`);
            }
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const readListTasks = (list) => {
    try {
        // Check if the JSON file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        // Read from the JSON file
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Parse the data
        const todos = JSON.parse(todoBuffer.toString());
        console.log("Parsed todos:", todos);

        // Find the specified list and print its tasks
        if (todos[list]) {
            console.log(`Tasks for list "${list}": ${todos[list].tasks.join(', ')}`);
        } else {
            console.log(`List "${list}" not found.`);
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const updateListName = (oldList, newList) => {
    try {
        // Check if the JSON file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        // Read from the JSON file
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Parse the data
        let todos = JSON.parse(todoBuffer.toString());
        console.log("Parsed todos:", todos);

        // Find the specified list and update its name
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
    try {
        // Check if the JSON file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        // Read from the JSON file
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Parse the data
        let todos = JSON.parse(todoBuffer.toString());
        console.log("Parsed todos:", todos);

        // Find the specified list
        if (todos[list]) {
            const taskIndex = todos[list].tasks.indexOf(oldTask);
            if (taskIndex !== -1) {
                todos[list].tasks[taskIndex] = newTask;

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
        // Check if the JSON file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        // Read from the JSON file
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Parse the data
        let todos = JSON.parse(todoBuffer.toString());
        console.log("Parsed todos:", todos);

        // Delete the specified list
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
    try {
        // Check if the JSON file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            console.log("No lists found.");
            return;
        }

        // Read from the JSON file
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Parse the data
        let todos = JSON.parse(todoBuffer.toString());
        console.log("Parsed todos:", todos);

        // Find the specified list
        if (todos[list]) {
            const taskIndex = todos[list].tasks.indexOf(taskToDelete);
            if (taskIndex !== -1) {
                todos[list].tasks.splice(taskIndex, 1);

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

module.exports = {
    createListTask,
    listAllLists,
    readListTasks,
    updateListName,
    updateTask,
    deleteList,
    deleteTask,
};
