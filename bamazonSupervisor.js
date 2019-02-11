var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');
var c = require("./db.js");

var connection = mysql.createConnection(c);

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showChoices();
});

function showChoices() {


    inquirer.prompt([

        {

            type: "list",
            message: "What do you want to do?",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"],
            name: "choice"
        },


    ])

        .then(function (inquirerResponse) {
            if (inquirerResponse.choice === "View Product Sales by Department") {
                showTable();

            }
            
            else if (inquirerResponse.choice === "Create New Department") {
                createDepartment();
            }

            else {
                exitBamazon()
            }

        });

}

// Query for information joining items in departments table with products table calculating total_profit for each department
function showTable() {
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, "
    query += "SUM(products.product_sales) AS product_sales, SUM(products.product_sales) - departments.over_head_costs AS total_profit "
    query += "FROM departments LEFT JOIN products ON (departments.department_name = products.department_name) "
    query += "GROUP BY departments.department_name"
    connection.query(query, function (err, res) {

        if (err) throw err;
      
        var table = cTable.getTable(res);
        console.log(table);

        showChoices();


    });
}


// Use inquirer to allow supervisor to specify department they want to add and overhead cost of this department
// Update departments table to insert new record 
function createDepartment() {
    inquirer.prompt([
        {

            type: "input",
            message: "Enter the name of the department you want to add",
            name: "name"
        },
        {

            type: "input",
            message: "Enter the overhead for this department",
            name: "overhead"
        }
       
    ])
        .then(function (inquirerResponse) {
            var query = connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: inquirerResponse.name,
                    over_head_costs: inquirerResponse.overhead
                    
            
                },
                function (err, res) {
                    console.log("Department added");
                    showChoices();
                }
              );
            


        });

}


function exitBamazon() {
    connection.end();
}