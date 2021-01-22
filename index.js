// Dependencies
// =========================================================
const inquirer = require("inquirer");
const mysql = require("mysql");
const figlet = require("figlet");
const Separator = require("choices-separator");
const clear = require("clear");
const queryFunctions = require("./Assets/Javascript/queryfunctions");
const util = require("util");

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
connection.query = util.promisify(connection.query);
// Functions
// =========================================================

function init() {
  userPrompt();
}

function userPrompt() {
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
      console.log(choice.userChoice);
      switch (choice.userChoice) {
        case "View All Employees":
          console.log("hi");
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Update Employee Role":
          break;
        case "Update Employee Manager":
          break;
        case "View All Roles":
          break;
        case "Add Role":
          addRole();
          break;
        case "Remove Role":
          break;
        case "View All Departments":
          break;
        case "Add Department":
          break;
        case "Remove Department":
          break;
        default:
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

// Ends connection.
function connectionEnd() {
  connection.end();
}

// View Employee's.
function viewEmployees() {
  const query = `SELECT first_name, last_name from employees`;
  connection.query(query, function (err, data) {
    if (err) throw err;
    clear();
    console.table(data);
    userPrompt();
  });
}

function addEmployee() {
  const idOfRoleQuery = `SELECT id FROM roles WHERE title=?`;
  const employeeQuery = `SELECT first_name, last_name FROM employees;`;
  const assignManagerQuery = `SELECT id FROM employees WHERE first_name=? AND last_name =?;`;
  inquirer.prompt([
    {
      type: "input",
      name: "newEmployeeFirstName",
      message: "What is your new hires first name?",
      default: "John",
    },
    {
      type: "input",
      name: "newEmployeeLastName",
      message: "What is your new hires last name?",
      default: "Doe",
    },
    {
      type: "list",
      name: "chooseRole",
      message: "Pick their role.",
      choices: roleQuery,
    },
  ]);
}

// Remove Employee.
function removeEmployee() {}

async function roleQuery() {
  const roleQuery = `SELECT title FROM roles;`;
  const query = await connection.query(roleQuery);
  const newArray = query.map((data) => {
    return data.title;
  });
  return newArray;
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What role do you want to add?",
        name: "title",
      },
      {
        type: "input",
        message: "What salary will this role receive?",
        name: "salary",
      },
      {
        type: "list",
        message: "what department does this role go in?",
        choices: ["hi", "hi2"], // TODO
      },
    ])
    .then((response) => {
      console.log(response);
    });
}
