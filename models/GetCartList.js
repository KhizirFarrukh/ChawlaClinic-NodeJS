const mysql = require('mysql');
function GetTotalAmount(SQL_Result, callback) {
    var TotalAmount = 0
    for(let i=0;i<SQL_Result.length;i+=1) {
        TotalAmount += SQL_Result[i].Quantity * SQL_Result[i].ProductPrice;
    }
    callback(TotalAmount);
}
function ExecuteQuery(PatientID, con, callback) {
    var sql = "SELECT prod.ProductID, prod.ProductName, cart.Quantity, prod.ProductPrice FROM products prod JOIN patientproductscart cart on prod.ProductID = cart.ProductID where cart.PatientID = " + PatientID + ";";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        GetTotalAmount(result, function(TotalAmount){
            console.log("Total Amount : " + TotalAmount);
            callback(result,TotalAmount);
        });
        
    });
}
module.exports = { ExecuteQuery };