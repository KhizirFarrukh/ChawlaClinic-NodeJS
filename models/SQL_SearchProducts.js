const mysql = require('mysql');
function ExecuteQuery(searchQuery, con, callback) {
    var sql = "SELECT prod.ProductID, prod.ProductName, prod.ProductPrice, invent.Quantity FROM products prod JOIN productinventory invent on prod.ProductID = invent.ProductID JOIN productcategory categ on categ.CategoryID = prod.ProductCategoryID WHERE categ.CategoryName != 'Dressing Pad' and categ.CategoryName != 'General homoeo medicine' AND LOWER(prod.ProductName) LIKE '%" + searchQuery + "%';";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };