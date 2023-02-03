function ExecuteQuery(id, ID_represents, arr_PaymentIDs, con, callback) {
  if(arr_PaymentIDs.length === 0) {
    callback([]);
  } else {
    const PaymentID_Match_Values = '(' + arr_PaymentIDs.join(', ') + ')';
    var dressing_sql;
    if(ID_represents === "Patient") {
      dressing_sql = "SELECT payment.PaymentID, dressing.QtyOfPads, dressing.DressingDate, dressing.TotalAmount FROM patientdressingrecord dressing RIGHT JOIN patientpaymentrecord payment ON dressing.PaymentID = payment.PaymentID WHERE payment.PatientID = " + id + " AND payment.PaymentID IN " + PaymentID_Match_Values + " ORDER BY payment.PaymentID DESC;";
    } else if(ID_represents === "Payment") {
      dressing_sql = "SELECT payment.PaymentID, dressing.QtyOfPads, dressing.DressingDate, dressing.TotalAmount FROM patientdressingrecord dressing RIGHT JOIN patientpaymentrecord payment ON dressing.PaymentID = payment.PaymentID WHERE payment.PaymentID = " + id + ";";
    }
    console.log(dressing_sql);
    
    con.query(dressing_sql, function (err, dressingResult) {
      if (err) throw err;

      var dressing_details = Object.values(JSON.parse(JSON.stringify(dressingResult)));

      callback(dressing_details);
    });
  }
  
}

module.exports = { ExecuteQuery };