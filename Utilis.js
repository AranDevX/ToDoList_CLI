const fs = require("fs");

const getTodos = () => {
    try {
        fs.accessSync('datas.json');
    } catch (err) {
        fs.writeFileSync('datas.json', JSON.stringify([])); // Initialize with an empty array if the file doesn't exist
    }
    
    const todoBuffer = fs.readFileSync("datas.json");
    return JSON.parse(todoBuffer.toString());
};

const saveTodos = (todos) => {
    const dataJSON = JSON.stringify(todos, null, 2);
    fs.writeFileSync("datas.json", dataJSON);
};

const createListTask = (list, task) => {
    if (!task || !task.trim()) {
        console.error("Task title cannot be empty.");
        return;
    }

    try {
        let todos = getTodos();

        let listIndex = todos.findIndex(item => item.list === list);

        if (listIndex === -1) {
            todos.push({ list, tasks: [{ title: task, completed: false }] });
        } else {
            if (todos[listIndex].tasks.some(existingTask => existingTask.title === task)) {
                console.log(`Task "${task}" already exists in list "${list}".`);
                return;
            }
            todos[listIndex].tasks.push({ title: task, completed: false });
        }

        saveTodos(todos);
        console.log("Task added successfully");
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const listAllLists = () => {
    try {
        let todos = getTodos();

        if (todos.length === 0) {
            console.log("No lists found.");
        } else {
            console.log("All lists:");
            todos.forEach(todo => {
                const tasks = todo.tasks.map(task => `${task.title} (Completed: ${task.completed})`).join(', ');
                console.log(`List: ${todo.list}, Tasks: ${tasks}`);
            });
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const readListTasks = (list) => {
    try {
        let todos = getTodos();
        let listData = todos.find(item => item.list === list);

        if (listData) {
            const tasks = listData.tasks.map(task => `${task.title} (Completed: ${task.completed})`).join(', ');
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
        let todos = getTodos();
        let listIndex = todos.findIndex(item => item.list === oldList);

        if (listIndex !== -1) {
            todos[listIndex].list = newList;
            saveTodos(todos);
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
        let todos = getTodos();
        let listIndex = todos.findIndex(item => item.list === list);

        if (listIndex !== -1) {
            let taskIndex = todos[listIndex].tasks.findIndex(task => task.title === oldTask);
            if (taskIndex !== -1) {
                todos[listIndex].tasks[taskIndex].title = newTask;
                saveTodos(todos);
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
        let todos = getTodos();
        const updatedTodos = todos.filter(item => item.list !== list);

        if (updatedTodos.length === todos.length) {
            console.log(`List "${list}" not found.`);
        } else {
            saveTodos(updatedTodos);
            console.log(`List "${list}" deleted successfully.`);
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
        let todos = getTodos();
        let listIndex = todos.findIndex(item => item.list === list);

        if (listIndex !== -1) {
            const tasks = todos[listIndex].tasks.filter(task => task.title !== taskToDelete);
            if (tasks.length === todos[listIndex].tasks.length) {
                console.log(`Task "${taskToDelete}" not found in list "${list}".`);
            } else {
                todos[listIndex].tasks = tasks;
                saveTodos(todos);
                console.log(`Task "${taskToDelete}" deleted successfully from list "${list}".`);
            }
        } else {
            console.log(`List "${list}" not found.`);
        }
    } catch (error) {
        console.error("An error occurred, try again:", error);
    }
};

const completeTask = (list, taskToComplete) => {
    if (!taskToComplete || !taskToComplete.trim()) {
        console.error("Task title cannot be empty.");
        return;
    }

    try {
        let todos = getTodos();
        let listIndex = todos.findIndex(item => item.list === list);

        if (listIndex !== -1) {
            let task = todos[listIndex].tasks.find(task => task.title === taskToComplete);
            if (task) {
                task.completed = true;
                saveTodos(todos);
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
    completeTask,
};
