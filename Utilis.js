const fs = require("fs");

const createListTask = (list, task) => {
    try {
        // check if the json file exists
        try {
            fs.accessSync('datas.json');
        } catch (err) {
            // if it does not exist, create a new json file
            fs.writeFileSync('datas.json', JSON.stringify([]));
        }

        // read from the todo.json if it exists
        const todoBuffer = fs.readFileSync("datas.json");
        // convert it to string
        let dataJSON = todoBuffer.toString();
        // parse the data
        const todos = JSON.parse(dataJSON);

        // check if the todo List exists
        const duplicateTodo = todos.find((task) => task.list === list);

        if (!duplicateTodo) {
            todos.push({ list: list, task: task });
            dataJSON = JSON.stringify(todos);
            fs.writeFileSync("datas.json", dataJSON);
            console.log("New Todo List Added");
        } else {
            console.log("Todo List already exists");
        }
    } catch (error) {
        console.log("An error occurred, try again");
    }
};

module.exports = {
    createListTask,
};
