USE tracker_db;


INSERT INTO departments (department_name)
VALUES ("Dev Team");

INSERT INTO roles (title, salary, department_id)
VALUES ("Project Leader", 75000, 001);

INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Dev", 50000, 001);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Allen", "Smith", 1, null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 2, 1);