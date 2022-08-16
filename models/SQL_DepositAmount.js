const mysql = require('mysql');
function ExecuteQuery(id, data, con) {
    var sql = "INSERT INTO patientpaymentrecord(`PatientID`,`TotalAmount`,`AmountPaid`,`AmountReduction`,`Date`,`AddedBy`) ";
    sql += "VALUES(" + id + "," + 0 + "," + data.depositamount + "," + 0 + ",STR_TO_DATE('" + data.depositdate + "','%Y-%m-%d'), 'ADMIN');";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
    });
}
module.exports = { ExecuteQuery };