const mysql = require('mysql');
function ExecuteQuery(padQty, padFraction, con, callback) {
    var sql = "SELECT prod.ProductName, prod.ProductPrice FROM products prod JOIN productcategory cat on prod.ProductCategoryID = cat.CategoryID where cat.CategoryName = 'Dressing Pad' ";
    sql += "AND ProductName = 'Dressing Pad 1'";
    if(padFraction != "0") {
        sql += " OR ProductName = 'Dressing Pad " + padFraction + " ";
        if(padQty > 0) {
            sql += "above 1'";
        } else {
            sql += "below 1'";
        }
    }
    console.log(sql)
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };