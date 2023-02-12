function ExecuteQuery(PaymentID, Payment_HashValue, con, callback) {
  var sql = "SELECT * FROM `patientpaymentsidentifiers` WHERE ";
  if(PaymentID !== undefined) {
    sql += "PaymentID = " + PaymentID + ";";
  } else if (Payment_HashValue !== undefined) {
    sql += "PaymentHashCode = '" + Payment_HashValue + "';";
  }
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}
module.exports = { ExecuteQuery };