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
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        var PadPrice = 0;
        PadPrice += result.find(object => object.ProductName === "Dressing Pad 1").ProductPrice * parseInt(padQty);
        if(padFraction != "0") {
            // const [numerator, denominator] = padFraction.split('/');
            // const padFractionValue = parseInt(numerator) / parseInt(denominator);
            PadPrice += result.find(object => object.ProductName.includes("Dressing Pad " + padFraction)).ProductPrice; 
        }

        callback(PadPrice);
    });
}
module.exports = { ExecuteQuery };