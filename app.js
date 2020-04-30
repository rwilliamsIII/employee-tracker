const inquirer = require("inquirer");
const connection = require("./connection");

connection.connect(function (err){
    if (err) throw err;
    console.log("connected as id: " + connection.threadId + "\n");
    userPrompt();
});

function userPrompt(){
    inquirer.prompt([
        {
            type: "list",
            choices: [
                "Add Department",
                "Add Employee",
                "Add Role",
                "View Departments",
                "View Employees",
                "View Roles",
                "Delete Department",
                "Delete Employee",
                "Delete Role",
                "Update Employee Role",
                "Finish"
            ],
            message: "What task would you like to do?",
            name: "userTask"
        }
    ])
    .then(function(res){
        const userSelect = res.userTask
        switch(userSelect){
            case "Add Department":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Please enter the name of the department you would like to add:",
                        name: "department_name"
                    }
                ])
                .then(function(response){
                    connection.query(
                        "INSERT INTO departments SET ?",
                        {
                            department_name: response.department_name,
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Department Added!")
                            connection.query("SELECT departments.id, departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON (departments.id = roles.dept_id) LEFT JOIN employees ON (roles.id = employees.role_id)", function(err, res){
                                if (err) throw err;
                                res.length > 0 && console.table(res);
                                userPrompt();
                            });
                        }
                    );
                });
                break;
            case "Add Employee":
                connection.query(
                    "SELECT * FROM roles",
                    function (err, roles) {
                        if (err) throw err;
                        connection.query(
                            "SELECT * FROM employees",
                            function (err, employees) {
                                if (err) throw err;
                                inquirer.prompt([
                                    {
                                        type: "input",
                                        message: "Please enter employee's first name:",
                                        name: "first_name"
                                    },
                                    {
                                        type: "input",
                                        message: "Please enter employee's last name:",
                                        name: "last_name"
                                    },
                                    {
                                        type: "list",
                                        choices: () => roles.map(role => `${role.id} ${role.title}`),
                                        message: "Select the employee's role:",
                                        name: "role_id"
                                    },
                                    {
                                        type: "list",
                                        choices: () => employees.map(employee => `${employee.id} ${employee.first_name} ${employee.last_name}`)
                                    }
                                ])
                                .then(function(ans){
                                    connection.query(
                                        "INSERT INTO employees SET ?",
                                        {
                                            first_name: ans.first_name,
                                            last_name: ans.last_name,
                                            role_id: ans.role_id.slice(0,2).trim(),
                                            manager_id: ans.manager_id.slice(0,2).trim()
                                        },
                                        function (err) {
                                            if (err) throw err;
                                            console.log("Employee Added!");
                                            connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, roles.id, departments.department_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)", function(err, res){
                                                if (err) throw err;
                                                res.length > 0 && console.table(res);
                                                userPrompt();
                                            });
                                        }
                                    );
                                });
                            }
                        )
                    }
                )
                break;
                case "Add Role":
                connection.query(
                    "SELECT * FROM departments",
                    function (err, departments) {
                        if (err) throw err;
                        inquirer.prompt([
                            {
                                type: "input",
                                message: "Enter name of role you'd like to add:",
                                name: "title"
                            },
                            {
                                type: "input",
                                message: "Enter the salary for the role you'd like to add:",
                                name: "salary"
                            },
                            {
                                type: "list",
                                choices: () => departments.map(department => `${department.id} ${department.department_name}`),
                                message: "Select department for the role you'd like to add:",
                                name: "department_id"
                            }
                        ])
                        .then(function(ans){
                            connection.query(
                                "INSERT INTO roles SET ?",
                                {
                                    title: ans.title,
                                    salary: ans.salary,
                                    department_id: ans.department_id.slice(0,2).trim()
                                },
                            function(err){
                                if (err) throw err;
                                console.log("Role Added!");
                                connection.query("SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles LEFT JOIN departments ON (roles.department_id = departments_id)", function(err, res){
                                    if (err) throw err;
                                    res.length > 0 && console.table(res);
                                    userPrompt();
                                })
                            }
                            )
                        })
                    }
                )
                break;
            case "View Departments":
                connection.query(
                    "SELECT departments.id, departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON (departments.id = roles.department_id) LEFT JOIN employees ON (roles.id = employees.role_id)", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        userPrompt();
                    }
                );
                break;
            case "View Employees":
                connection.query(
                    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, roles.id, departments.department_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = department_id)", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        userPrompt();
                    }
                );
                break;
            case "View Roles":
                connection.query(
                    "SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles LEFT JOIN departments ON (roles.department_id = departments_id)", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        userPrompt();
                    }
                );
                break;
            case "Delete Department":
                connection.query(
                    "SELECT departments.id, departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON (departments.id = roles.department_id) LEFT JOIN employees ON (roles.id = employees.role_id)", function (err, departments) {
                        if (err) throw err;
                        departments.length > 0 && console.table(departments);
                        inquirer.prompt([
                            {
                                type: "list",
                                choices: () => departments.map(department => `${department.id} ${department.department_name}`),
                                message: "Select department you would like to delete:",
                                name: "deleteDepartment"
                            }
                        ])
                        .then(function(ans){
                            connection.query(
                                "DELETE FROM departments WHERE id = ?",
                                [ans.deleteDepartment.slice(0,2).trim()],
                                function (err, res) {
                                    if (err) throw err;
                                    connection.query(
                                        "SELECT departments.id, departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON (departments.id = roles.department_id) LEFT JOIN employees ON (roles.id = employees.role_id)", function (err, res) {
                                            if (err) throw err;
                                            res.length > 0 && console.table(res);
                                            userPrompt();
                                        }
                                    )
                                }
                            )
                        });
                    }
                )
                break;
            case "Delete Employee":
                connection.query(
                    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)", function (err, employees) {
                        if (err) throw err;
                        employees.length > 0 && console.table(employees);
                        inquirer.prompt([
                            {
                                type: "list",
                                choices: () => employees.map(employee => `${employee.first_name} ${employee.last_name} ${employee.id}`),
                                message: "Select employee you would like to delete:",
                                name: "deleteEmployee"
                            }
                        ])
                        .then(function(ans){
                            connection.query(
                                "DELETE FROM employees WHERE id = ?",
                                [ans.deleteEmployee.slice(0,2).trim()],
                                function (err, res) {
                                    if (err) throw err;
                                    connection.query(
                                        "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)", function (err, res) {
                                            if (err) throw err;
                                            res.length > 0 && console.table(res);
                                            userPrompt();
                                        }
                                    )
                                }
                            )
                        });
                    }
                )
                break;
            case "Delete Role":
                connection.query(
                    "SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles LEFT JOIN departments ON (roles.department_id = departments.id)", function(err, roles) {
                        if (err) throw err;
                        roles.length > 0 && console.table(roles);
                        inquirer.prompt([
                            {
                                type: "list",
                                choices: () => roles.map(role => `${role.id} ${role.title}`),
                                message: "Select the role you would like to delete:",
                                name: "deleteRole"
                            }
                        ])
                        .then(function(ans){
                            connection.query(
                                "DELETE FROM roles WHERE id = ?",
                                [ans.deleteRole.slice(0,2).trim()],
                                function (err, res){
                                    if (err) throw err;
                                    connection.query(
                                        "SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles LEFT JOIN departments ON (roles.department_id = departments.id)", function(err, res) {
                                            if (err) throw err;
                                            res.length > 0 && console.table(res);
                                            userPrompt();
                                        }
                                    )
                                }
                            )
                        });
                    }
                )
                break;
            case "Update Employee Role":
                connection.query(
                    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)", function (err, roles) {
                        if (err) throw err;
                        connection.query(
                            "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)", function (err, employees) {
                                if (err) throw err;
                                inquirer.prompt([
                                    {
                                        type: "list",
                                        choices: () => employees.map(employee => `${employee.first_name} ${employee.last_name} ${employee.id}`),
                                        message: "Select employee you would like to update:",
                                        name: "updateEmployee"
                                    },
                                    {
                                        type: "list",
                                        choices: () => roles.map(role => `${role.id} ${role.title}`),
                                        message: "Select updated role for the selected employee:",
                                        name: "updatedRole"
                                    }
                                ])
                                .then(function(ans){
                                    connection.query(
                                        "UPDATE employees SET role_id=? WHERE id=?",
                                        [ans.updateEmployee.slice(0,1), ans.updatedRole.slice(0,2).trim()],
                                        function (err, res) {
                                            if (err) throw err;
                                            console.log("Employee Updated!")
                                            connection.query(
                                                "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, roles.id, departments.department_id FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)", function(err, res) {
                                                    if (err) throw err;
                                                    res.length > 0 && console.table(res);
                                                    userPrompt();
                                                }
                                            )
                                        }
                                    )
                                });
                            }
                        )
                    }
                )
                break;
            case "Finish":
                connection.end();
                break;
            default:
                break;
        }
    })
}