DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  stock_quantity INTEGER(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Canvas Wall Art - Birch Trees Forest on a Foggy Day", "Home Decor", 29.99, 10),
       ("Chesapeake Bay Candle Mind & Body Scented Candle", "Home Decor", 19.99, 30),
       ("Instant Pot 6 Qt 6-in-1 Multi-Use Pressure Cooker","Kitchen & Dining",79.00, 40),
       ("Keurig K-Classic Coffee Maker K-Cup Pod","Kitchen & Dining",89.99, 20),
       ("Memory Foam Bath Mat","Bed & Bath",12.99, 37),
       ("AmazonBasics 7-Piece Bed-In-A-Bag - Full/Queen","Bed & Bath",41.88, 22),
       ("George Foreman 15-Serving Indoor/Outdoor Electric Grill","Garden & Outdoor", 77.98, 50),
       ("Intex 77in PureSpa Portable Bubble Massage Spa Set","Garden & Outdoor", 367.52, 4),
       ("Dresser Shoal Creek 4-Drawer, White","Furniture",125.00, 15),
       ("Little Giant 22-Foot Ladder","Home Improvement",199.98,27);


