var mysql = require('mysql');
var inq = require('inquirer');
// create connection

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "r2005moner",
    database: "bamazon_db"
});

//select all from DB
connection.query("select * from products", function (err, res) {
    if (err) throw err;
    console.log("connected!!");
    console.table(res);
    ask_customer();
})

//ask user questions
function ask_customer() {
    inq.prompt([{
        name: "ID_question",
        message: "Check table above and type in ID of wanted product"
    }, {
        name: "quantity_question",
        message: "How many whould like to have??"
    }]).then(function (answer) {
        var ID = parseInt(answer.ID_question);
        var required_quantity = parseInt(answer.quantity_question)

        console.log(ID);
        console.log(required_quantity)
        stock(ID, required_quantity)
    })
}

function stock(ID, required_quantity) {
    connection.query(`select stock_quantity from products where item_id = ${ID}`, function (err, res) {
        if (err) throw err;
        var back_stock = JSON.stringify(res[0].stock_quantity)
        console.log(back_stock);
        if (back_stock >= required_quantity) {
            console.log("we have enough for you");
            get_cost(ID, required_quantity);
            update_DB(ID, required_quantity, back_stock);

        } else {
            console.log("Insufficient quantity!");
            ask_customer();

        }
    })
}

function get_cost(ID, required_quantity) {
    connection.query(`select price from products where item_id = ${ID}`, function (err, res) {
        if (err) throw err;
        var customer_cost = JSON.stringify(res[0].price)
        console.log("$" + (customer_cost * required_quantity))
    })
}

function update_DB(ID, required_quantity, back_stock) {
    var new_back_stock = back_stock - required_quantity;

    connection.query(`UPDATE products SET stock_quantity = ${new_back_stock} WHERE item_id = ${ID}`, function (err) {
        if (err) throw err;
        console.log("record updated!!!!!!!!!!")
    })

}