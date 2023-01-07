const mysql = require('mysql');
function ExecuteQuery(id, retrieveLimit, con, callback) {
    // var sql = "SELECT prodpurchase.Quantity, prod.ProductName, pay.TotalAmount, pay.Date from patientproductspurchased prodpurchase JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID JOIN products prod ON prodpurchase.ProductID = prod.ProductID where pay.PatientID = " + id + " ORDER BY pay.Date DESC";
    // var sql = "SELECT prodpurchaseitems.Quantity, prod.ProductName, prodpurchase.TotalAmount, pay.date from patientproductspurchased prodpurchase JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID JOIN products prod ON prodpurchase.ProductID = prod.ProductID JOIN patientproductspurchaseditems prodpurchaseitems ON prodpurchase.PurchaseID = prodpurchaseitems.PurchaseID where pay.PatientID = " + id + " ORDER BY pay.Date DESC";
    if(retrieveLimit == true ) {
        sql += " LIMIT 5";
    }
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };