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

yargs.parse(); // Parse the arguments to activate the yargs commands
