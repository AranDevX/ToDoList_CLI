const fs = require("fs");

const getData = () => {
    try {
        const todoBuffer = fs.readFileSync("datas.json");
        return JSON.parse(todoBuffer.toString());
    } catch (e) {
        return []; // Return an empty array if the file doesn't exist or an error occurs
    }
};

const saveData = (data) => {
    const dataJSON = JSON.stringify(data, null, 2);
    fs.writeFileSync("datas.json", dataJSON);
};

const createListTask = (listName, taskTitle) => {
    if (!taskTitle || !taskTitle.trim()) {
        console.error("Task title cannot be empty.");
        return;
    }

    const data = getData();

    let list = data.find((l) => l.listName === listName);

    if (!list) {
        list = { listName, tasks: [] };
        data.push(list);
    }

    const taskExists = list.tasks.some((task) => task.title === taskTitle);

    if (taskExists) {
        console.log(`Task "${taskTitle}" already exists in list "${listName}".`);
        return;
    }

    list.tasks.push({ title: taskTitle, completed: false });
    saveData(data);
    console.log("Task added successfully");
};

const listAllLists = () => {
    const data = getData();

    if (data.length === 0) {
        console.log("No lists found.");
    } else {
        console.log("All lists:");
        data.forEach(list => {
            const tasks = list.tasks.map(task => `${task.title} (Completed: ${task.completed})`).join(', ');
            console.log(`List: ${list.listName}, Tasks: ${tasks}`);
        });
    }
};

const readListTasks = (listName) => {
    const data = getData();

    const list = data.find((l) => l.listName === listName);

    if (list) {
        const tasks = list.tasks.map(task => `${task.title} (Completed: ${task.completed})`).join(', ');
        console.log(`Tasks for list "${listName}": ${tasks}`);
    } else {
        console.log(`List "${listName}" not found.`);
    }
};

const updateListName = (oldListName, newListName) => {
    const data = getData();

    const list = data.find((l) => l.listName === oldListName);

    if (list) {
        list.listName = newListName;
        saveData(data);
        console.log(`List name "${oldListName}" updated to "${newListName}"`);
    } else {
        console.log(`List "${oldListName}" not found.`);
    }
};

const updateTask = (listName, oldTaskTitle, newTaskTitle) => {
    const data = getData();

    const list = data.find((l) => l.listName === listName);

    if (list) {
        const task = list.tasks.find((t) => t.title === oldTaskTitle);
        if (task) {
            task.title = newTaskTitle;
            saveData(data);
            console.log(`Task "${oldTaskTitle}" updated to "${newTaskTitle}" in list "${listName}".`);
        } else {
            console.log(`Task "${oldTaskTitle}" not found in list "${listName}".`);
        }
    } else {
        console.log(`List "${listName}" not found.`);
    }
};

const deleteList = (listName) => {
    const data = getData();

    const newData = data.filter((l) => l.listName !== listName);

    if (newData.length !== data.length) {
        saveData(newData);
        console.log(`List "${listName}" deleted successfully.`);
    } else {
        console.log(`List "${listName}" not found.`);
    }
};

const deleteTask = (listName, taskTitle) => {
    const data = getData();

    const list = data.find((l) => l.listName === listName);

    if (list) {
        const newTasks = list.tasks.filter((t) => t.title !== taskTitle);

        if (newTasks.length !== list.tasks.length) {
            list.tasks = newTasks;
            saveData(data);
            console.log(`Task "${taskTitle}" deleted successfully from list "${listName}".`);
        } else {
            console.log(`Task "${taskTitle}" not found in list "${listName}".`);
        }
    } else {
        console.log(`List "${listName}" not found.`);
    }
};

const completeTask = (listName, taskTitle) => {
    const data = getData();

    const list = data.find((l) => l.listName === listName);

    if (list) {
        const task = list.tasks.find((t) => t.title === taskTitle);
        if (task) {
            task.completed = true;
            saveData(data);
            console.log(`Task "${taskTitle}" marked as completed in list "${listName}".`);
        } else {
            console.log(`Task "${taskTitle}" not found in list "${listName}".`);
        }
    } else {
        console.log(`List "${listName}" not found.`);
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
