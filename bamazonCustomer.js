var mysql = require("mysql");
var inquirer = require("inquirer");

// connecting information for the sql database

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// username and password

	user: "root",

	password: "",

	database: "Bamazon"
});

// function to connect to the bamazon database
connection.connect(function(err) {
  if (err) throw err;
  console.log('Yeay it is connected');  
  createTable ();
});

var createTable = function(){
  connection.query('SELECT * FROM products', function(err, res) {
    for (var i = 0; i < res.length; i++) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name +" | $" + res[i].price + " | " + res[i].stock_quanity);
      }
      promptCustomer(res);
    })
}

// ask the user the ID of the product they would like to buy
 var promptCustomer = function(res){
  inquirer.prompt([{
  name: "id", 
  type: "input",
  message: "which item id you wish to purchase?"
},{
  //How many units of product
  name: 'quantity',
  type: 'input',
  message: 'How many would you like to buy?'


}]).then(function (answers){
productNumber = answers.id 
 itemQuantity = answers.quantity;

connection.query('SELECT * FROM products WHERE ?', {item_id: productNumber}, function(err, data) {
  if (err) throw err;

  var item = data[0];

  console.log(answers.quantity);
  console.log(item);
  // if your store does have enough of the product, you should fulfill the customer's order.Update the SQL database to reflect the remaining quantity.
  connection.query('SELECT item_id, product_name, price, stock_quanity FROM products WHERE item_id= ' + productNumber,
    function(err, res) {
    if (err) throw err;
    if (res[0].stock_quanity < itemQuantity) {
    console.log("Sorry We do not have that many items in stock. Please select another" + res[0].stock_quanity);
  } else {
    connection.query("UPDATE products SET ? WHERE ?",
      [{stock_quanity:res[0].stock_quanity - itemQuantity}, {item_id: productNumber}],
      function(err, result){});
    if (itemQuantity === '1') {
      console.log("Total: $" + (res[0].price * item_Quanity) + " for your purchase of " + itemQuantity + " " + res[0].product_name);
    } else {
      console.log("Total: $" + (res[0].price * item_Quanity) + " for your purchase of " + itemQuantity + " " + res[0].product_name);
    }
      console.log("Inventory has been updated.");
      createTable();
    }
     });
   });
 });
}
