# bamazon

### Overview

bamazon is an Amazon-like storefront that can take in orders from customers, deplete stock from the store's inventory, track product sales across departments and provide a summary of the highest-grossing departments in the store.
There are 3 command line application that can be run under node.js,bamazonCustomer, bamazonManager and bamazonSupervisor and data is stored in a MySQL database.

bamazonCustomer allows a customer to purchase an item. If there is sufficient quantity to meet the customers request, the order is fulfilled.

bamazonManager allows a manager to view all products for sale, view low inventory, add to inventory or add new product.

bamazonSupervisor allows a supervisor to view product sales by department or create a new department.

Each app connects to the database using the configuration stored in db.js.


### Dependencies

package.json lists the dependencies that will need to be installed prior to executing any of the bamazon apps. 
This includes inquirer, mysql and console.table.


### Video

Screen recordings can be found at https://drive.google.com/file/d/1mQ5hsa6ahPq2Fu2wRNLqiZKMmPsM9QCF/view for bamazonCustomer
                               at https://drive.google.com/file/d/1hqHn2l4BUXLeN9n6lRnN1Obcu9tTW48X/view for bamazonManager
                               at https://drive.google.com/file/d/1kkdgDavbgNicJT6UBxXLEgR28Myf3f0j/view for bamazonSupervisor