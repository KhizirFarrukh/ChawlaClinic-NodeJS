const mysql = require('mysql');

function ExecuteQuery(PatientID, PurchaseDate, con, SQL_GetCartList, callback) {
    SQL_GetCartList.ExecuteQuery(PatientID, con, function(cartInfo,TotalAmount){
        console.log(cartInfo);
        for(let i=0;i<cartInfo.length;i+=1) {
            var DeleteFromCartSQL = "DELETE FROM patientcart WHERE ProductID = " + cartInfo[i].ProductID + " AND PatientID = " + PatientID + ";";
            console.log(DeleteFromCartSQL);
            con.query(DeleteFromCartSQL, function (err, result) {
                if (err) throw err;
                console.log(result);
                var InsertToPaymentsSQL = "INSERT INTO patientpaymentrecord(`PatientID`,`TotalAmount`,`AmountPaid`,`AmountReduction`,`Date`,`AddedBy`) ";
                InsertToPaymentsSQL += "VALUES(" + PatientID + "," + (cartInfo[i].ProductPrice * cartInfo[i].Quantity) + "," + (cartInfo[i].ProductPrice * cartInfo[i].Quantity) + "," + 0 + ",STR_TO_DATE('" + PurchaseDate + "','%Y-%m-%d'), 'ADMIN');";
                console.log(InsertToPaymentsSQL);
                con.query(InsertToPaymentsSQL, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    console.log(result.insertId);
                    var PaymentID = result.insertId;
                    var InsertToPurchasesSQL = "INSERT INTO patientproductpurchasehistory(`PatientID`,`ProductID`,`PaymentID`,`Quantity`) ";
                    InsertToPurchasesSQL += "VALUES(" + PatientID + "," + cartInfo[i].ProductID + "," + PaymentID + "," + cartInfo[i].Quantity + ");";
                    console.log(InsertToPurchasesSQL);
                    con.query(InsertToPurchasesSQL, function (err, result) {
                        if (err) throw err;
                        console.log(result);
                    });
                });
            });
        }
        callback();
    });
    
}
module.exports = { ExecuteQuery };