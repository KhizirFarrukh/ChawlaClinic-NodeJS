const mysql = require('mysql');
function ExecuteQuery(data, con, callback) {
    if(data.discountamount == undefined) {
        data.discountamount = 0;
    }
    var payment_sql = "INSERT INTO patientpaymentrecord(`PatientID`,`TotalAmount`,`AmountPaid`,`AmountReduction`,`Date`) ";
    payment_sql += "VALUES(" + data.id + "," + data.totalamount + "," + data.amountpaid + "," + data.discountamount + ",STR_TO_DATE('" + data.dressingdate + "','%Y-%m-%d'));";
    console.log(payment_sql);
    con.query(payment_sql, function (err, result) {
        if (err) throw err;
        var PaymentID = result.insertId;
        var padQty = parseFloat(data.padquantity) + parseFloat(eval(data.padfraction));
        var dressing_sql = "INSERT INTO patientdressingrecord(`PatientID`,`PaymentID`,`QtyOfPads`) ";
        dressing_sql += "VALUES(" + data.id + "," + PaymentID + "," + padQty + ");";
        console.log(dressing_sql);
        con.query(dressing_sql, function (err, result) {
            if (err) throw err;
            if(data.discountamount > 0) {
                var discount_sql = "INSERT INTO discounts(`PaymentID`,`DiscountOption`) VALUES(" + PaymentID + ",(SELECT DiscountMode FROM patientdetails where PatientID = " + data.id + "));";
                con.query(discount_sql, function (err, result) {
                    if (err) throw err;
                    callback(result);
                });
            } else {
                callback(result);
            }
        });
    });
}
module.exports = { ExecuteQuery };