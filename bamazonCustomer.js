var inquirer = require("inquirer");
var mysql = require("mysql");
var c = require("./db.js");

var connection = mysql.createConnection(c);

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showItems();
});

function showItems() {
    console.log("Items available for sale...\n");
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement

        for (var i = 0; i < res.length; i++) {
            stringToPrint = res[i].item_id + ":" +
                res[i].product_name + " Cost = $" +
                res[i].price;
            console.log(stringToPrint);

        }
        console.log("\n\n")

        startTransaction();


    });
}

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

                    if (res[0].stock_quantity < inquirerResponse.quantity) {
                        console.log("We're very sorry but we have insufficient quantity to fulfill your order");
                        connection.end();
                    }
                    else {
                        var totalCost = res[0].price * inquirerResponse.quantity;
                        var remainingQuantity = parseInt(res[0].stock_quantity) - parseInt(inquirerResponse.quantity);
                        var productSales = parseFloat(res[0].product_sales) + parseFloat(totalCost);
                        productSales =  Number(productSales).toFixed(2); 
                        fulfillOrder(inquirerResponse.itemNum,
                            remainingQuantity, totalCost, productSales);
                    }


                });


        });

}

function fulfillOrder(itemNum, quantity, cost, sales) {
    console.log("Fulfilling order...\n");
    var query = connection.query(
        "UPDATE products SET ?, ? WHERE ?",
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
            connection.end();
        }
    );

}






