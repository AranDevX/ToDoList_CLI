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
yargs.parse(); // Parse the arguments to activate the yargs commands
