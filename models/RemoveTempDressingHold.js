function ExecuteQuery(TempID, con, callback) {
  var removetempdressing_sql = "DELETE FROM patientdressingtemphold WHERE TempID = " + TempID;
  console.log(removetempdressing_sql);
  con.query(removetempdressing_sql, function (err) {
    if (err) throw err;
    callback();
  });
}
module.exports = { ExecuteQuery };