function ExecuteQuery(Payment_HashValue, con, callback) {
  var sql = "SELECT PaymentID FROM `patientpaymentsidentifiers` WHERE PaymentHashCode = '" + Payment_HashValue + "';";
  console.log(sql);
  con.query(sql, function (err, result) {
      if (err) throw err;
      callback(result);
  });
}
module.exports = { ExecuteQuery };