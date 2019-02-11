var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');
var c = require("./db.js");

var connection = mysql.createConnection(c);

// Connect to local db and show items
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showItems();
});

// Query for all items in products table
function showItems() {
    console.log("Items available for sale...\n");
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;

        var table = cTable.getTable(res);
        console.log(table);

        startTransaction();


    });
}

// Use inquirer to allow user to specify item they want to purchase and quantity
function startTransaction() {

    inquirer.prompt([

        {

            type: "input",
            message: "Please enter the id of the item you would like to purchase",
            name: "itemNum"
        },
        {
            type: "input",
            message: "How many units would you like to purchase?",
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

                    // Check to see if stock_quantity is sufficient to fulfill request
                    if (res[0].stock_quantity < inquirerResponse.quantity) {
                        console.log("We're very sorry but we have insufficient quantity to fulfill your order");
                        continueShopping();
                    }
                    else {
                        // Calculate totalCost, remainingQuantity and productSales values
                        var totalCost = res[0].price * inquirerResponse.quantity;
                        var remainingQuantity = parseInt(res[0].stock_quantity) - parseInt(inquirerResponse.quantity);
                        var productSales = parseFloat(res[0].product_sales) + parseFloat(totalCost);
                        productSales = Number(productSales).toFixed(2);
                        fulfillOrder(inquirerResponse.itemNum,
                            remainingQuantity, totalCost, productSales);
                    }


                });


        });

}

// Update products table reducing quantity and adding to product Sales
// If update is successful, inform user of total cost of purchase.
// Use inquirer package to ask if user wants to make another purchase 
function fulfillOrder(itemNum, quantity, cost, sales) {
    console.log("Fulfilling order...\n");
    var query = connection.query("UPDATE products SET ?, ? WHERE ?",
        [
            {
                stock_quantity: quantity
            },
            {
                product_sales: sales
            },
            {
                item_id: itemNum
            }
        ],
        function (err, res) {
            console.log("Total cost of your purchase is $" + Number(cost).toFixed(2));
            continueShopping();
        });



}

function continueShopping() {
    inquirer.prompt([

        {

            type: "confirm",
            message: "Would you like to make another purchase?",
            name: "continue"
        }
    ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.continue === true)
                showItems();
            else
                connection.end();
        });

}








