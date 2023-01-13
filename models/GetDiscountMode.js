const mysql = require('mysql');
function ExecuteQuery(PatientID, con, callback) {
    var sql = "SELECT DiscountMode FROM patientdetails where PatientID = " + PatientID + ";";
    console.log(sql)
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };