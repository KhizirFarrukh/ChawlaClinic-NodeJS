function ExecuteQuery(id, con, callback) {
    var sql = "SELECT * FROM `patientdressingtemphold` WHERE PatientID = " + id + " ORDER BY DressingDate;";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };