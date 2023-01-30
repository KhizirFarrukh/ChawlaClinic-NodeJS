const mysql = require('mysql');
function ExecuteQuery(PatientID, con, callback) {
    var sql = "SELECT prod.ProductID, prod.ProductName, cart.Quantity, prod.ProductPrice FROM products prod JOIN patientproductscart cart on prod.ProductID = cart.ProductID where cart.PatientID = " + PatientID + ";";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        const TotalAmount = result.reduce((total, cartItem) => total + (cartItem.ProductPrice * cartItem.Quantity), 0);
        console.log("Total Amount : " + TotalAmount);
        
        callback(result,TotalAmount);
    });
}
module.exports = { ExecuteQuery };