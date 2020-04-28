const inquirer = require("inquirer");
const connection = require("./connection");

connection.connect(function (err){
    if (err) throw err;
    console.log("connected as id: " + connection.threadId + "\n");
    userPrompt();
});

const userPrompt = () => {
    
}