const mysql = require('mysql');

function ExecuteQuery(id, arr_PaymentIDs, con, callback) {
  const PaymentID_Match_Values = '(' + arr_PaymentIDs.join(', ') + ')';
  const dressing_sql = "SELECT payment.PaymentID, dressing.QtyOfPads, dressing.DressingDate, dressing.TotalAmount FROM patientdressingrecord dressing RIGHT JOIN patientpaymentrecord payment ON dressing.PaymentID = payment.PaymentID WHERE payment.PatientID = " + id + " AND payment.PaymentID IN " + PaymentID_Match_Values + " ORDER BY payment.PaymentID DESC";
  
  console.log(dressing_sql);
  
  con.query(dressing_sql, function (err, dressingResult) {
    if (err) throw err;

    var dressing_details = Object.values(JSON.parse(JSON.stringify(dressingResult)));

    callback(dressing_details);
  });
}

module.exports = { ExecuteQuery };