const fs = require ("fs");

const createListTask = (List, Task) => {
    try {
                // check if the json file exists
    fs.access('data.json', (err) => {
        // if it does not exist, create a new json file
        if (err){
            fs.writeFileSync('data.json', JSON.stringify([]))
        }
         // read from the todo.json if it exists
        const todoBuffer = fs.readFileSync("data.json");
        // convert it to string
        let dataJSON = todoBuffer.toString();
        // parse the data
        const todos = JSON.parse(dataJSON);

        // check if the todo List exists
        const duplicateTodo = todos.find((task) => {
            return task.list === list;
        })

        if (!duplicateTodo) {
            todos.push({
                List: List,
                Task: Task,
            });
            dataJSON = JSON.stringify(todos);
            fs.writeFileSync("data.json", dataJSON);
            console.log("New Todo List Added");
        } else {
            console.log("New Todo List has already been used");
        }

    })

    }catch(error){
        console.log("An error occured, try again")
    }
    
};

module.exports = {
    createListTask,
};
