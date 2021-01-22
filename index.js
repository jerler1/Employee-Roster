// Dependencies
// =========================================================
const inquirer = require("inquirer");
const mysql = require("mysql");
const figlet = require("figlet");
const Separator = require("choices-separator");
const clear = require("clear");
const { exit } = require("process");
const { endianness } = require("os");

// Creating a connection to the SQL Server
// =========================================================
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "kitty1",
  database: "rosterDB",
});

// Connecting to the SQL Server
// =========================================================
connection.connect(function (err) {
  if (err) throw err;

  // Start the program.
  init();
});

// Functions
// =========================================================

function init() {
  userPrompt();
}

function userPrompt() {
  clear();
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "userChoice",
        choices: [
          "View All Employees",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View All Roles",
          "Add Role",
          "Remove Role",
          "View All Departments",
          "Add Department",
          "Remove Department",
          "Exit",
        ],
      },
    ])
    .then((choice) => {
      switch (choice.choices) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          // code block
          break;
        case "Remove Employee":
          // code block
          break;
        case "Update Employee Role":
          // code block
          break;
        case "Update Employee Manager":
          // code block
          break;
        case "View All Roles":
          // code block
          break;
        case "Add Role":
          // code block
          break;
        case "Remove Role":
          // code block
          break;
        case "View All Departments":
          // code block
          break;
        case "Add Department":
          // code block
          break;
        case "Remove Department":
          // code block
          break;
        case "Exit":
          connectionEnd();
          break;
      }
    });
}

function ascii() {
  figlet(
    "Employee",
    {
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("Ooops!");
        console.dir(err);
        return;
      }
      console.log(data);
    }
  );
  figlet(
    "Roster",
    {
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 60,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("Ooops!");
        console.dir(err);
        return;
      }
      console.log(data);
    }
  );
}

function connectionEnd() {
  connection.end();
}

function viewEmployees() {
  const query = `SELECT first_name, last_name from employees`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    userPrompt();
  });
}
