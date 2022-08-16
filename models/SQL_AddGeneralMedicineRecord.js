const mysql = require('mysql');
function ExecuteQuery(data, con, callback) {
    if(data.discountamount == undefined) {
        data.discountamount = 0;
    }
    var payment_sql = "INSERT INTO patientpaymentrecord(`PatientID`,`TotalAmount`,`AmountPaid`,`AmountReduction`,`Date`,`AddedBy`) ";
    payment_sql += "VALUES(" + data.id + "," + data.totalamount + "," + data.amountpaid + "," + data.discountamount + ",STR_TO_DATE('" + data.medicinedate + "','%Y-%m-%d'), 'ADMIN');";
    console.log(payment_sql);
    con.query(payment_sql, function (err, result, fields) {
        if (err) throw err;
        var general_sql = "INSERT INTO patientgeneralmedicinerecord(`PatientID`,`PaymentID`,`ProductID`) ";
        general_sql += "VALUES(" + data.id + "," + result.insertId + "," + padQty + ");";
        console.log(general_sql);
        con.query(general_sql, function (err, result, fields) {
            if (err) throw err;
            callback(result);
        });
    });
}
module.exports = { ExecuteQuery };