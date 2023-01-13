const mysql = require('mysql');
function ExecuteQuery(PatientID, con, callback) {
  var removetempdressing_sql = "DELETE FROM patientdressingtemphold WHERE PatientID = " + PatientID;
  console.log(removetempdressing_sql);
  con.query(removetempdressing_sql, function (err) {
    if (err) throw err;
    callback();
  });
}
module.exports = { ExecuteQuery };