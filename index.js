// Dependencies
// =========================================================
const inquirer = require("inquirer");
const mysql = require("mysql");
const figlet = require("figlet");
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
  userPrompt();
});
connection.query = util.promisify(connection.query);
// Functions
// =========================================================

// Main function - Allows the user to find the options they want to use.
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
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Exit",
        ],
      },
    ])
    .then((choice) => {
      console.log(choice.userChoice);
      switch (choice.userChoice) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
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
  const query = `SELECT first_name, last_name, title, salary, department FROM employees 
  INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id;
  `;
  connection.query(query, function (err, data) {
    if (err) throw err;
    clear();
    console.table(data);
    userPrompt();
  });
}

function addEmployee() {
  inquirer
    .prompt([
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
      {
        type: "list",
        name: "chooseManager",
        message: "Pick their manager",
        choices: employeeQuery,
      },
    ])
    .then(async (answers) => {
      console.log(answers);
      const roleID = await acquireRoleID(answers.chooseRole);
      let managerID = "";
      if (answers.chooseManager) {
        managerID = await acquireManagerID(answers.chooseManager);
      } else {
        managerID = NULL;
      }
      const values = [
        answers.newEmployeeFirstName,
        answers.newEmployeeLastName,
        roleID,
        managerID,
      ];
      console.log(values);
      const query = `INSERT INTO employees(first_name, last_name, role_id, manager_id)
      VALUES(?,?,?,?);`;
      connection.query(query, values, (err, data) => {
        if (err) throw err;
        console.log("Added Employee!");
      });
      userPrompt();
    });
}

async function roleQuery() {
  const roleQuery = `SELECT title FROM roles;`;
  const query = await connection.query(roleQuery);
  const newArray = query.map((data) => {
    return data.title;
  });
  return newArray;
}
async function employeeQuery() {
  const employeeQuery = `SELECT first_name, last_name FROM employees;`;
  const query = await connection.query(employeeQuery);
  const newArray = query.map((data) => {
    return data.first_name + " " + data.last_name;
  });
  return newArray;
}
async function acquireRoleID(role) {
  const idOfRoleQuery = `SELECT id FROM roles WHERE title=?`;
  const query = await connection.query(idOfRoleQuery, [role]);
  return query[0].id;
}
async function acquireManagerID(manager) {
  const split = manager.split(" ");
  const assignManagerQuery = `SELECT id FROM employees WHERE first_name=? AND last_name =?;`;
  const query = await connection.query(assignManagerQuery, [
    split[0],
    split[1],
  ]);
  return query[0].id;
}
async function departmentQuery() {
  const departmentQuery = `SELECT department FROM departments;`;
  const query = await connection.query(departmentQuery);
  const newArray = query.map((data) => {
    return data.department;
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
        name: "chooseDepartment",
        message: "what department does this role go in?",
        choices: departmentQuery,
      },
    ])
    .then(async (response) => {
      const departmentID = await idDepartmentQuery(response.chooseDepartment);
      const query = `INSERT INTO roles(title, salary, department_id)
      VALUES(?,?,?);`;
      const values = [response.title, response.salary, departmentID];
      connection.query(query, values, function (err, data) {
        if (err) throw err;
      });
      userPrompt();
    });
}

// Update Employee
function updateEmployee() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What employee do you want to update?",
        name: "chooseEmployee",
        choices: employeeQuery,
      },
      {
        type: "list",
        message: "What role do you want to promote them to?",
        name: "chooseRole",
        choices: roleQuery,
      },
    ])
    .then(async function (response) {
      const split = response.chooseEmployee.split(" ");
      const queryRole = `SELECT id FROM roles WHERE title=?;`;
      const newRole = await connection.query(queryRole, [response.chooseRole]);
      const values = [newRole[0].id, split[0], split[1]];
      const newQuery = `UPDATE employees SET role_id=? WHERE first_name=? AND last_name=?;`;
      connection.query(newQuery, values);
      userPrompt();
    });
}

async function idDepartmentQuery(department) {
  const query = `SELECT id FROM departments WHERE department=?;`;
  const id = await connection.query(query, [department]);
  console.log(id[0].id);
  return id[0].id;
}

function viewRoles() {
  const query = `SELECT title FROM roles;`;
  connection.query(query, (err, data) => {
    clear();
    console.table(data);
    userPrompt();
  });
}
function viewDepartments() {
  const query = `SELECT department FROM departments;`;
  connection.query(query, (err, data) => {
    clear();
    console.table(data);
    userPrompt();
  });
}
