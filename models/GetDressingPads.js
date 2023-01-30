function ExecuteQuery(con, callback) {
    var sql = "SELECT prod.ProductID, prod.ProductName, prod.ProductPrice FROM products prod JOIN productcategory categ ON prod.ProductCategoryID = categ.CategoryID WHERE categ.CategoryName = 'Dressing Pad' ORDER BY prod.ProductID ASC;";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };