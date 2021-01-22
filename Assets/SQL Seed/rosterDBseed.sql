DROP DATABASE IF EXISTS rosterDB;
CREATE database rosterDB;
USE rosterDB;

CREATE TABLE departments (
id INTEGER auto_increment PRIMARY KEY NOT NULL,
department VARCHAR(30) NOT NULL
); 

INSERT INTO departments(department) VALUES ("Human Resources");
INSERT INTO departments(department) VALUES ("Nuclear Power Research");
INSERT INTO departments(department) VALUES ("Fission Reactor");

CREATE TABLE roles (
id INT NOT NULL auto_increment PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INT NOT NULL,
FOREIGN KEY (department_id) references departments(id)
);

INSERT INTO roles(title,salary,department_id) VALUES ("Human Resource Manager", 45000.00, 1);
INSERT INTO roles(title,salary,department_id) VALUES ("Human Resource Liason", 40000.00, 1);
INSERT INTO roles(title,salary,department_id) VALUES ("Nuclear Researcher Manager", 140000.00, 2);
INSERT INTO roles(title,salary,department_id) VALUES ("Nuclear R&D", 110000.00, 2);
INSERT INTO roles(title,salary,department_id) VALUES ("Reactor Supervisor", 90000.00, 3);
INSERT INTO roles(title,salary,department_id) VALUES ("Reactor Janitor", 55000.00, 3);

CREATE TABLE employees (
id INT NOT NULL auto_increment PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
FOREIGN KEY (role_id) references roles(id),
FOREIGN KEY (manager_id) references employees(id)
);

INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("John", "Smith", 2, NULL);
INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("Jane", "Doe", 1, 1);
INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("Mr", "Burns", 5, 1);
INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("Homer", "Simpson", 6, 1);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;
SELECT title FROM roles;
SELECT id FROM roles WHERE title=?;

