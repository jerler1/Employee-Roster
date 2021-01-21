DROP DATABASE IF EXISTS rosterDB;
CREATE database rosterDB;
USE rosterDB;

CREATE TABLE departments (
id INTEGER PRIMARY KEY NOT NULL,
department VARCHAR(30) NOT NULL
); 

INSERT INTO departments(id, department) VALUES (1, "Human Resources");
INSERT INTO departments(id, department) VALUES (2, "Nuclear Power Research");
INSERT INTO departments(id, department) VALUES (3, "Fission Reactor");

CREATE TABLE roles (
id INT NOT NULL PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INT NOT NULL,
FOREIGN KEY (department_id) references departments(id)
);

INSERT INTO roles(id, title,salary,department_id) VALUES (1, "Human Resource Manager", 45000.00, 1);
INSERT INTO roles(id, title,salary,department_id) VALUES (2, "Human Resource Liason", 40000.00, 1);
INSERT INTO roles(id, title,salary,department_id) VALUES (3, "Nuclear Researcher Manager", 140000.00, 2);
INSERT INTO roles(id, title,salary,department_id) VALUES (4, "Nuclear R&D", 110000.00, 2);
INSERT INTO roles(id, title,salary,department_id) VALUES (5, "Reactor Supervisor", 90000.00, 3);
INSERT INTO roles(id, title,salary,department_id) VALUES (6, "Reactor Janitor", 55000.00, 3);

CREATE TABLE employees (
id INT NOT NULL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
FOREIGN KEY (role_id) references roles(id)
);

INSERT INTO employees(id, first_name, last_name, role_id) VALUES (1, "John", "Smith", 2);
INSERT INTO employees(id, first_name, last_name, role_id) VALUES (2, "Jane", "Doe", 1);
INSERT INTO employees(id, first_name, last_name, role_id) VALUES (3, "Mr", "Burns", 5);
INSERT INTO employees(id, first_name, last_name, role_id) VALUES (4, "Homer", "Simpson", 6);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;

