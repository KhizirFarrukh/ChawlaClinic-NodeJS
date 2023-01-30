function ExecuteQuery(con, callback) {
    var sql = "SELECT disc_prods.ProductID, prods.ProductName, prods.ProductPrice, categ.CategoryName FROM `discontinuedproducts` disc_prods JOIN `products` prods ON disc_prods.ProductID = prods.ProductID JOIN `productcategory` categ ON prods.ProductCategoryID = categ.CategoryID;";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };