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
        // Convert it to string
        let dataJSON = todoBuffer.toString();
        // Parse the data
        const todos = JSON.parse(dataJSON);

        // Find the todo list
        let listExists = false;
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].list === list) {
                listExists = true;
                todos[i].tasks.push(task);
                break;
            }
        }

        // If the list doesn't exist, create a new one
        if (!listExists) {
            todos.push({
                list: list,
                tasks: [task],
            });
        }

        // Write back to the JSON file
        dataJSON = JSON.stringify(todos, null, 2);
        fs.writeFileSync("datas.json", dataJSON);
        console.log("Task added successfully");
    } catch (error) {
        console.log("An error occurred, try again");
    }
};

module.exports = {
    createListTask,
};
