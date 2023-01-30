function ExecuteQuery(id, retrieveLimit, con, callback) {
  var payment_sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction AS \"Discount\", pay.Date, DressingSum.DressingCharges, OintmentSum.OintmentCharges, OtherProdsSum.ProductCharges from patientpaymentrecord pay left join (SELECT pay.PaymentID, SUM(dressing.TotalAmount) AS \"DressingCharges\" FROM patientpaymentrecord pay left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = " + id + ") group by pay.PaymentID) AS DressingSum on pay.PaymentID = DressingSum.PaymentID left join (SELECT pay.PaymentID, SUM(ointmentpurchase.Amount) AS \"OintmentCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = " + id + ") group by pay.PaymentID) AS OintmentSum ON pay.PaymentID = OintmentSum.PaymentID left join (SELECT pay.PaymentID, SUM(otherprods.Amount) AS \"ProductCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientotherprodspurchased otherprods ON prodpurchase.PurchaseID = otherprods.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = " + id + ") group by pay.PaymentID) AS OtherProdsSum ON pay.PaymentID = OtherProdsSum.PaymentID where pay.PatientID = " + id + " group by pay.PaymentID order by pay.Date DESC, pay.PaymentID DESC";
  if(retrieveLimit == true ) {
    payment_sql += " LIMIT 5";
  }

  console.log(payment_sql);

  con.query(payment_sql, function (err, paymentResult) {
    if (err) throw err;

    var payment_details = Object.values(JSON.parse(JSON.stringify(paymentResult)));

    callback(payment_details);
  });
}

module.exports = { ExecuteQuery };