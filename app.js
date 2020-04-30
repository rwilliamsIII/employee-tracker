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
                        name: "new_dept"
                    }
                ])
                .then(function(response){
                    connection.query(
                        "INSERT INTO departments SET ?",
                        {
                            new_dept: response.new_dept
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Department Added!")
                            connection.query("SELECT departments.id, departments.new_dept, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON (departments.id = roles.dept_id) LEFT JOIN employees ON (roles.id = employees.role_id)", function(err, res){
                                if (err) throw err;
                                res.length > 0 && console.table(res);
                                userPrompt();
                            });
                        }
                    );
                });
                break;
        }
    })
}