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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "choice"
        },


    ])

        .then(function (inquirerResponse) {
            if (inquirerResponse.choice === "View Products for Sale") {
                showItems();

            }
            else if (inquirerResponse.choice === "View Low Inventory") {
                showLowInventory();
            }
            else if (inquirerResponse.choice === "Add to Inventory") {
                addInventory();
            }
            else if (inquirerResponse.choice === "Add New Product") {
                addProduct();
            }

            else {
                exitBamazon()
            }

        });

}

// Query for all items in products table
function showItems() {
    console.log("Products for sale ...\n");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        var table = cTable.getTable(res);
        console.log(table);
        
        showChoices();


    });
}

// Query for items in products table where stock_quantity is less than 5
function showLowInventory() {
    console.log("Products for sale ...\n");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        var table = cTable.getTable(res);
        console.log(table);

        showChoices();


    });
}

// Use inquirer to allow manager to specify item they want to add to and quantity
// Update products table increasing quantity for specified item
function addInventory() {
    inquirer.prompt([
        {

            type: "input",
            message: "Please enter the id of the item you want to add to",
            name: "itemNum"
        },
        {
            type: "input",
            message: "How many units would you like to add?",
            name: "quantity"
        }
    ])
        .then(function (inquirerResponse) {
            connection.query(
                "SELECT * FROM products WHERE ?",
                {
                    item_id: inquirerResponse.itemNum
                },
                function (err, res) {
                    if (err) throw err;
                    var quantityToUpdate = parseInt(res[0].stock_quantity) + parseInt(inquirerResponse.quantity);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: quantityToUpdate
                            },
                            {
                                item_id: inquirerResponse.itemNum
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;
                            console.log(inquirerResponse.quantity + " units added");
                            showChoices();
                        }
                    );
                });
        });

}


// Use inquirer to allow manager to specify new product they want to add to and quantity
// Update products table to insert new record
function addProduct() {
    inquirer.prompt([
        {

            type: "input",
            message: "Enter the name of the product you want to add",
            name: "name"
        },
        {

            type: "input",
            message: "Enter the department for this product",
            name: "dept"
        },
        {
            type: "input",
            message: "Enter the cost per unit",
            name: "price"
        },
        {
            type: "input",
            message: "How many units would you like to add?",
            name: "quantity"
        }
    ])
        .then(function (inquirerResponse) {
            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: inquirerResponse.name,
                    department_name: inquirerResponse.dept,
                    price: inquirerResponse.price,
                    stock_quantity: inquirerResponse.quantity
            
                },
                function (err, res) {
                    console.log("Product added");
                    showChoices();
                }
              );
            


        });

}


function exitBamazon() {
    connection.end();
}



