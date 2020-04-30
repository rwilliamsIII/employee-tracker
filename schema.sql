DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;


USE tracker_db;

CREATE TABLE departments (
    id INTEGER(20) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INTEGER(20) AUTO_INCREMENT NOT NULL,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL NOT NUll,
    department_id INTEGER(20) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employees (
    id INTEGER(20) AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    role_id INTEGER(20) NOT NULL,
    manager_id INTEGER(20),
    PRIMARY KEY(id)
);