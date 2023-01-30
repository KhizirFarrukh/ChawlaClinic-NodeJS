function ExecuteQuery(id, con, callback) {
    var sql = "SELECT SUM(TotalAmount) AS \"total\",SUM(AmountPaid) AS \"paid\",SUM(AmountReduction) AS \"discount\" from patientpaymentrecord where PatientID = " + id + ";";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };