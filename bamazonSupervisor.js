var inquirer = require("inquirer");
var mysql = require("mysql");
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

function showTable() {
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, "
    query += "SUM(products.product_sales) AS product_sales, product_sales - departments.over_head_costs AS total_profit "
    query += "FROM departments LEFT JOIN products ON (departments.department_name = products.department_name) "
    query += "GROUP BY departments.department_name"
    connection.query(query, function (err, res) {

        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("| department_id |  department_name  | over_head_costs | product_sales | total_profit |");
        console.log("| ------------- | ----------------- | --------------- | ------------- | ------------ |")


        for (var i = 0; i < res.length; i++) {
            var product_sales;
            var total_profit;
            if (res[i].product_sales === null) {
                product_sales = 0;
                total_profit = 0  - res[i].over_head_costs;
            }
            else {
                product_sales = res[i].product_sales;
                total_profit = res[i].total_profit;
            }
            
            stringToPrint = "| " + res[i].department_id.toString().padEnd(13) + " | " +
                res[i].department_name.padEnd(17) + " | " +
                res[i].over_head_costs.toString().padEnd(15) +  " | " + 
                product_sales.toString().padEnd(13) + " | " +
                total_profit.toString().padEnd(12) + " | ";
                
            console.log(stringToPrint);

        }
        console.log("\n\n")

        showChoices();


    });
}



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