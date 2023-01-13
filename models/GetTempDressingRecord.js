const mysql = require('mysql');
function ExecuteQuery(id, con, callback) {
    var sql = "SELECT * FROM `patientdressingtemphold` WHERE PatientID = " + id + ";";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };