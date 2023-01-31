function ExecuteQuery(PaymentID, con, callback) {
  // var sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.Date, DressingSum.DressingCharges, OintmentSum.OintmentCharges, OtherProdsSum.ProductCharges from patientpaymentrecord pay left join (SELECT pay.PaymentID, SUM(dressing.TotalAmount) AS \"DressingCharges\" FROM patientpaymentrecord pay left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID WHERE pay.PaymentID = " + PaymentID + ") AS DressingSum on pay.PaymentID = DressingSum.PaymentID left join (SELECT pay.PaymentID, SUM(ointmentpurchase.Amount) AS \"OintmentCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID WHERE pay.PaymentID = " + PaymentID + ") AS OintmentSum ON pay.PaymentID = OintmentSum.PaymentID left join (SELECT pay.PaymentID, SUM(otherprods.Amount) AS \"ProductCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientotherprodspurchased otherprods ON prodpurchase.PurchaseID = otherprods.PurchaseID WHERE pay.PaymentID = " + PaymentID + ") AS OtherProdsSum ON pay.PaymentID = OtherProdsSum.PaymentID where pay.PaymentID = " + PaymentID + ";";
  var sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.Date from patientpaymentrecord pay where pay.PaymentID = " + PaymentID + ";";
  console.log(sql);
  con.query(sql, function (err, result) {
      if (err) throw err;
      callback(result);
  });
}
module.exports = { ExecuteQuery };