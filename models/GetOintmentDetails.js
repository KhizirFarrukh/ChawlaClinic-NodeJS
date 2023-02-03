function ExecuteQuery(id, ID_represents, arr_PaymentIDs, con, callback) {
  if(arr_PaymentIDs.length === 0) {
    callback([]);
  } else {
    const PaymentID_Match_Values = '(' + arr_PaymentIDs.join(', ') + ')';
    var ointment_sql;
    if(ID_represents === "Patient") {
      ointment_sql = "SELECT prod.ProductName, oint.Quantity, oint.Amount, pay.PaymentID FROM products prod JOIN patientointmentpurchased oint on prod.ProductID = oint.ProductID JOIN patientproductspurchased prodpurchase ON oint.PurchaseID = prodpurchase.PurchaseID RIGHT JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID WHERE pay.PatientID = " + id + " AND pay.PaymentID IN " + PaymentID_Match_Values + " ORDER BY pay.PaymentID DESC;";                
    } else if(ID_represents === "Payment") {
      ointment_sql = "SELECT prod.ProductName, oint.Quantity, oint.Amount, pay.PaymentID FROM products prod JOIN patientointmentpurchased oint on prod.ProductID = oint.ProductID JOIN patientproductspurchased prodpurchase ON oint.PurchaseID = prodpurchase.PurchaseID RIGHT JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID WHERE pay.PaymentID = " + id + ";";                
    }
    console.log(ointment_sql);

    con.query(ointment_sql, function (err, ointmentResult) {
      if (err) throw err;

      var ointment_details = Object.values(JSON.parse(JSON.stringify(ointmentResult)));

      callback(ointment_details);
    });
  }
}

module.exports = { ExecuteQuery };