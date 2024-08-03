const fs = require("fs");

const createListTask = (list, task) => {
    try {
        // Check if the JSON file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            // If it does not exist, create a new JSON file
            fs.writeFileSync('datas.json', JSON.stringify([]));
        }

        // Read from the JSON file if it exists
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");
        
        // Convert it to string
        let dataJSON = todoBuffer.toString();
        console.log("File content:", dataJSON);

        // Parse the data
        let todos;
        try {
            todos = JSON.parse(dataJSON);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            todos = [];
        }
        
        console.log("Parsed todos:", todos);

        // Find the todo list
        let listExists = false;
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].list === list) {
                listExists = true;

                // If the task property already exists, append the new task
                if (todos[i].task) {
                    todos[i].task += `, ${task}`; // Concatenate tasks with a comma
                } else {
                    todos[i].task = task; // Set the task if it does not exist
                }
                break;
            }
        }

        // If the list doesn't exist, create a new one
        if (!listExists) {
            todos.push({
                list: list,
                task: task, // Store the first task as a string
            });
        }

        // Write back to the JSON file
        dataJSON = JSON.stringify(todos, null, 2);
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
            // If it does not exist, log that there are no lists
            console.log("No lists found.");
            return;
        }

        // Read from the JSON file if it exists
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");
        
        // Convert it to string
        let dataJSON = todoBuffer.toString();
        console.log("File content:", dataJSON);

        // Parse the data
        let todos;
        try {
            todos = JSON.parse(dataJSON);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            todos = [];
        }
        
        console.log("Parsed todos:", todos);

        // List all the lists
        if (todos.length === 0) {
            console.log("No lists found.");
        } else {
            console.log("All lists:");
            todos.forEach((todo) => {
                console.log(`List: ${todo.list}, Tasks: ${todo.task}`);
            });
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

        // Read from the JSON file if it exists
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Convert it to string
        let dataJSON = todoBuffer.toString();
        console.log("File content:", dataJSON);

        // Parse the data
        let todos;
        try {
            todos = JSON.parse(dataJSON);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            todos = [];
        }

        console.log("Parsed todos:", todos);

        // Find the specified list and print its tasks
        const todo = todos.find((todo) => todo.list === list);
        if (todo) {
            console.log(`Tasks for list "${list}": ${todo.task}`);
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

        // Read from the JSON file if it exists
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Convert it to string
        let dataJSON = todoBuffer.toString();
        console.log("File content:", dataJSON);

        // Parse the data
        let todos;
        try {
            todos = JSON.parse(dataJSON);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            todos = [];
        }

        console.log("Parsed todos:", todos);

        // Find the specified list and update its name
        const todo = todos.find((todo) => todo.list === oldList);
        if (todo) {
            todo.list = newList;
            dataJSON = JSON.stringify(todos, null, 2);
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

        // Read from the JSON file if it exists
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Convert it to string
        let dataJSON = todoBuffer.toString();
        console.log("File content:", dataJSON);

        // Parse the data
        let todos;
        try {
            todos = JSON.parse(dataJSON);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            todos = [];
        }

        console.log("Parsed todos:", todos);

        // Find the specified list
        const todoList = todos.find(todo => todo.list === list);
        if (!todoList) {
            console.log(`List "${list}" not found.`);
            return;
        }

        // Update the specified task
        const tasks = todoList.task.split(', '); // Split tasks into an array
        const taskIndex = tasks.indexOf(oldTask);
        if (taskIndex === -1) {
            console.log(`Task "${oldTask}" not found in list "${list}".`);
            return;
        }

        tasks[taskIndex] = newTask; // Update the task
        todoList.task = tasks.join(', '); // Join tasks back to a string

        // Write back the updated data to the JSON file
        dataJSON = JSON.stringify(todos, null, 2);
        fs.writeFileSync("datas.json", dataJSON);
        console.log(`Task "${oldTask}" updated to "${newTask}" in list "${list}".`);
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

        // Read from the JSON file if it exists
        const todoBuffer = fs.readFileSync("datas.json");
        console.log("File read successfully");

        // Convert it to string
        let dataJSON = todoBuffer.toString();
        console.log("File content:", dataJSON);

        // Parse the data
        let todos;
        try {
            todos = JSON.parse(dataJSON);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            todos = [];
        }

        console.log("Parsed todos:", todos);

        // Filter out the specified list
        const filteredTodos = todos.filter(todo => todo.list !== list);

        // If no lists were removed, notify the user
        if (filteredTodos.length === todos.length) {
            console.log(`List "${list}" not found.`);
            return;
        }

        // Write back the updated data to the JSON file
        dataJSON = JSON.stringify(filteredTodos, null, 2);
        fs.writeFileSync("datas.json", dataJSON);
        console.log(`List "${list}" deleted successfully.`);
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
};
