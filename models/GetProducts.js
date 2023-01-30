function ExecuteQuery(con, callback) {
    var sql = "SELECT prod.ProductID, prod.ProductName, prod.ProductPrice, prod.ProductCategoryID, categ.CategoryName, invent.Quantity FROM products prod JOIN productcategory categ ON prod.ProductCategoryID = categ.CategoryID JOIN productinventory invent ON prod.ProductID = invent.ProductID WHERE categ.CategoryName != 'Dressing Pad' AND prod.ProductID NOT IN (SELECT ProductID FROM discontinuedproducts) ORDER BY prod.ProductName ASC;"; // add not condition for general medicines when they are added
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };