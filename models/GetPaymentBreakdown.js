const mysql = require('mysql');

function ExecuteQuery(id, retrieveLimit, con, callback) {
  var payment_sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction AS \"Discount\", pay.Date, SUM(ointmentpurchase.Amount) AS \"OintmentCharges\", SUM(otherprods.Amount) AS \"ProductCharges\", dressing.TotalAmount AS \"DressingCharges\" from patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID left JOIN patientotherprodspurchased otherprods ON prodpurchase.PurchaseID = otherprods.PurchaseID left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID where pay.PatientID = " + id + " group by ointmentpurchase.PurchaseID, otherprods.PurchaseID, dressing.DressingID order by pay.Date DESC, pay.PaymentID ASC"

  if(retrieveLimit == true ) {
    payment_sql += " LIMIT 5";
  }

  console.log(payment_sql);

  con.query(payment_sql, function (err, paymentResult) {
    if (err) throw err;

    var payment_details = Object.values(JSON.parse(JSON.stringify(paymentResult)));
    // console.log(payment_details);

    callback(payment_details);
  });
}

module.exports = { ExecuteQuery };