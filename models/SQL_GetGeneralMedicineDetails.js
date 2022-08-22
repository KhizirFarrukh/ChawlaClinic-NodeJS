const mysql = require('mysql');
function ExecuteQuery(id, retrieveLimit, con, callback) {
    // var sql = "SELECT dress.QtyOfPads, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction, pay.Date from patientdressingrecord dress JOIN patientpaymentrecord pay ON dress.PaymentID = pay.PaymentID where pay.PatientID = " + id + " ORDER BY pay.Date DESC";
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