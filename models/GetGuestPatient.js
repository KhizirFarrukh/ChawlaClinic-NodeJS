const mysql = require('mysql');
function ExecuteQuery(con, callback) {
    var sql = "SELECT PatientID, CaseNo FROM `patientdetails` WHERE CaseNo = 'Guest';";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };