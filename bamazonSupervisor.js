var mysql = require('mysql');
var inq = require('inquirer');
// create connection

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "r2005moner",
    database: "bamazon_db"
});

inq.prompt(
    [{
        type: "list",
        name: "menu_option",
        message: "Choice from list bellow:",
        choices: [
            "View Product Sales by Department",
            "Create New Department"
        ]
    }]
).then(function (answer) {
    let Choice = (answer.menu_option);
    switch (Choice) {
        case "View Product Sales by Department":
            display_dep();
            break;
        case "Create New Department":
            break;
    }

})

function display_dep() {
    inq.prompt([{
        type: "list",
        name: "menu_option",
        message: "Choice from list bellow:",
        choices: [
            "Electronics",
            "Gaming",
            "Clothes",
            "Shoes",
            "Dairy",
            "Producer",
            "Candy"
        ]
    }]).then(function (answer) {
        console.log(answer.menu_option);
        let department_name = answer.menu_option;
        display_dep_sales(department_name);
    })
}

function display_dep_sales(department_name) {
    connection.query(`SELECT DISTINCT departments.department_id,departments.department_name,departments.over_head_costs, sum(product_sales) as "product_sales", sum(product_sales) - departments.over_head_costs  as "total_profit"
    FROM departments
    LEFT JOIN products ON departments.department_name = products.department_name
    where departments.department_name = "${department_name}"
    group by departments.department_name`, function (err, res) {
        if (err) throw err
        console.table(res)
    })
}