// Master
const yargs = require("yargs");
const Utilis = require("./Utilis");

// This is where we will put create List first
yargs.command({
    command: "add",
    describe: "Add a List-Task",
    builder: {
        list: {
            describe: "Todo List title",
            type: "string",
            demandOption: true,
        },
        task: {
            describe: "Todo Task title",
            type: "string",
            demandOption: true,
        },
    },
    handler: function (argv) {
        console.log("Handler called with args:", argv); // Debugging line
        Utilis.createListTask(argv.list, argv.task);
    }
});

// Command to list all lists with their tasks
yargs.command({
    command: "listit",
    describe: "List all Todo Lists",
    handler: function () {
        Utilis.listAllLists();
    }
});

// Command to read tasks from a specified list
yargs.command({
    command: "read",
    describe: "Read tasks from a specified list",
    builder: {
        list: {
            describe: "Todo List title",
            type: "string",
            demandOption: true,
        },
    },
    handler: function (argv) {
        console.log("Handler called with args:", argv); // Debugging line
        Utilis.readListTasks(argv.list);
    }
});

// Command to update a list name
yargs.command({
    command: "update",
    describe: "Update the name of a specified list",
    builder: {
        oldName: {
            describe: "Current name of the Todo List",
            type: "string",
            demandOption: true,
        },
        newName: {
            describe: "New name for the Todo List",
            type: "string",
            demandOption: true,
        },
    },
    handler: function (argv) {
        console.log("Handler called with args:", argv); // Debugging line
        Utilis.updateListName(argv.oldName, argv.newName);
    }
});
//command to update a task
yargs.command({
    command: "updateTask",
    describe: "Update a task in a specified list",
    builder: {
        list: {
            describe: "Todo List title",
            type: "string",
            demandOption: true,
        },
        oldTask: {
            describe: "Current task title",
            type: "string",
            demandOption: true,
        },
        newTask: {
            describe: "New task title",
            type: "string",
            demandOption: true,
        },
    },
    handler: function (argv) {
        console.log("Handler called with args:", argv); // Debugging line
        Utilis.updateTask(argv.list, argv.oldTask, argv.newTask);
    }
});

// Command to delete a specified list
yargs.command({
    command: "delete",
    describe: "Delete a specified list",
    builder: {
        list: {
            describe: "Todo List title",
            type: "string",
            demandOption: true,
        },
    },
    handler: function (argv) {
        console.log("Handler called with args:", argv); // Debugging line
        Utilis.deleteList(argv.list);
    }
});

// Command to delete a task from a specified list
yargs.command({
    command: "deleteTask",
    describe: "Delete a task from a specified list",
    builder: {
        list: {
            describe: "Todo List title",
            type: "string",
            demandOption: true,
        },
        task: {
            describe: "Task title to delete",
            type: "string",
            demandOption: true,
        },
    },
    handler: function (argv) {
        console.log("Handler called with args:", argv); // Debugging line
        Utilis.deleteTask(argv.list, argv.task);
    }
});

yargs.parse(); // Parse the arguments to activate the yargs commands
