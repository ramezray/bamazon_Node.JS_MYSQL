var mysql = require('mysql');
var inq = require('inquirer');
// create connection

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "r2005moner",
    database: "bamazon_db"
});

ask_manager();

//ask user questions
function ask_manager() {
    inq.prompt([{
        type: "list",
        name: "menu_options",
        message: "Choice one query from list bellow:",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            ">>>>Exit"
        ]
    }]).then(function (answer) {
        var choice = answer.menu_options

        console.log(choice);
        switch (choice) {
            case "View Products for Sale":
                //console.log("for sale");
                show_all();
                break;
            case "View Low Inventory":
                // console.log("low");
                lower_than_five()
                break;
            case "Add to Inventory":
                show_all_items();
                add_to_inventory();

                // console.log("Item added");
                break;
            case "Add New Product":
                add_new_produect()
               // console.log("new");
                break;
            case ">>>>Exit":
                process.exit();
                break;
        }
    })
}

//select all from DB
function show_all() {
    connection.query("select item_id as ID, product_name as Name, price as Price, stock_quantity as Quantity from products", function (err, res) {
        if (err) throw err;
        console.table(res);
        ask_manager();
    })
}

//select quantity lower 5
function lower_than_five() {
    connection.query("select * from products where stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.table(res);
        ask_manager();
    })
}

function add_to_inventory() {
    inq.prompt([{
        type: "input",
        name: "item_ID",
        message: "What is the ID of the item?"

    }, {
        type: "input",
        name: "add_quantity",
        message: "How much you want to add to this item?"

    }]).then(function (answer) {
        var ID = answer.item_ID;
        var new_quantity = answer.add_quantity;
        update_DB(ID, new_quantity);
        show_all_items();
        ask_manager();
        // console.log(answer.item_ID);
        // console.log(answer.add_quantity);

    })
}

function show_all_items() {
    connection.query("select * from products", function (err, res) {
        if (err) throw err;
        console.log("connected!!");
        console.table(res);
    })
}

function update_DB(ID, new_quantity) {
    connection.query(`UPDATE products SET stock_quantity = ${new_quantity} WHERE item_id = ${ID}`, function (err) {
        if (err) throw err;
        console.log("record updated!!!!!!!!!!")
    })

}

function add_new_produect() {
    inq.prompt([{
        type: "input",
        name: "product_name",
        message: "Type in product name?"

    }, {
        type: "input",
        name: "department_name",
        message: "Which department?"

    }, {
        type: "input",
        name: "price",
        message: "What is the price?"

    }, {
        type: "input",
        name: "stock_quantity",
        message: "What is quantity?"

    }]).then(function (answer) {
        var ID = answer.item_ID;
        var new_quantity = answer.add_quantity;
        update_DB(ID, new_quantity);
        show_all_items();
        ask_manager();
        // console.log(answer.item_ID);
        // console.log(answer.add_quantity);

    })
}

function intsert_data(product_name, department_name, price, stock_quantity) {
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values (${product_name}, ${department_name}, ${price}, ${stock_quantity})`, function (err) {
        if (err) throw err;
        console.log("ok!");

    })
}