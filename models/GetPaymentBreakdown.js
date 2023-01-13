const mysql = require('mysql');

function ExecuteQuery(id, retrieveLimit, con, callback) {
  // var payment_sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction AS \"Discount\", pay.Date, SUM(ointmentpurchase.Amount) AS \"OintmentCharges\", SUM(otherprods.Amount) AS \"ProductCharges\", dressing.TotalAmount AS \"DressingCharges\" from patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID left JOIN patientotherprodspurchased otherprods ON prodpurchase.PurchaseID = otherprods.PurchaseID left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID where pay.PatientID = " + id + " group by ointmentpurchase.PurchaseID, otherprods.PurchaseID, dressing.DressingID, pay.PaymentID order by pay.PaymentID DESC"
  // var payment_sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction AS \"Discount\", pay.Date, dressing.TotalAmount AS \"DressingCharges\" from patientpaymentrecord pay left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID where pay.PatientID = " + id + " group by pay.PaymentID order by pay.PaymentID DESC"
  var payment_sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction AS \"Discount\", pay.Date, dressing.TotalAmount AS \"DressingCharges\", OintmentSum.OintmentCharges, OtherProdsSum.ProductCharges from patientpaymentrecord pay left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID left join (SELECT pay.PaymentID, SUM(ointmentpurchase.Amount) AS \"OintmentCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = " + id + ") group by pay.PaymentID) AS OintmentSum ON pay.PaymentID = OintmentSum.PaymentID left join (SELECT pay.PaymentID, SUM(otherprods.Amount) AS \"ProductCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientotherprodspurchased otherprods ON prodpurchase.PurchaseID = otherprods.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = " + id + ") group by pay.PaymentID) AS OtherProdsSum ON pay.PaymentID = OtherProdsSum.PaymentID where pay.PatientID = " + id + " group by pay.PaymentID order by pay.Date DESC, pay.PaymentID DESC";
  if(retrieveLimit == true ) {
    payment_sql += " LIMIT 5";
  }

  console.log(payment_sql);

  con.query(payment_sql, function (err, paymentResult) {
    if (err) throw err;

    var payment_details = Object.values(JSON.parse(JSON.stringify(paymentResult)));

    // console.log(payment_details);
    // console.log(paymentResult);
    callback(payment_details);
  });
}

module.exports = { ExecuteQuery };


// SELECT pay.PaymentID, SUM(ointmentpurchase.Amount) AS "OintmentCharges" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = 140870 order by pay.PaymentID DESC) group by pay.PaymentID; 

// SELECT pay.PaymentID, SUM(otherprods.Amount) AS "ProductCharges" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientotherprodspurchased otherprods ON prodpurchase.PurchaseID = otherprods.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = 140870 order by pay.PaymentID DESC) group by pay.PaymentID;