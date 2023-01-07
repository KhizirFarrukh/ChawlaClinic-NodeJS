const mysql = require('mysql');

function ExecuteQuery(id, retrieveLimit, con, callback) {
  // var payment_sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction AS \"Discount\", pay.Date, SUM(ointmentpurchase.Amount) AS \"OintmentCharges\", dressing.TotalAmount AS \"DressingCharges\" from patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID where pay.PatientID = " + id + " group by ointmentpurchase.PurchaseID order by pay.PaymentID"

  var ointment_sql = "";

  if(retrieveLimit == true ) {
    ointment_sql = "SELECT prod.ProductName, oint.Quantity, oint.Amount, pay.PaymentID FROM products prod JOIN patientointmentpurchased oint on prod.ProductID = oint.ProductID JOIN patientproductspurchased prodpurchase ON oint.PurchaseID = prodpurchase.PurchaseID RIGHT JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID JOIN (SELECT PaymentID FROM patientpaymentrecord WHERE PatientID = " + id + " LIMIT 5) AS subq ON subq.PaymentID = pay.PaymentID WHERE pay.PatientID = " + id;
  } else {
    ointment_sql = "SELECT prod.ProductName, oint.Quantity, oint.Amount, pay.PaymentID FROM products prod JOIN patientointmentpurchased oint on prod.ProductID = oint.ProductID JOIN patientproductspurchased prodpurchase ON oint.PurchaseID = prodpurchase.PurchaseID RIGHT JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID WHERE pay.PatientID = " + id;
  }                 

  console.log(ointment_sql);

  con.query(ointment_sql, function (err, ointmentResult) {
    if (err) throw err;

    var ointment_details = Object.values(JSON.parse(JSON.stringify(ointmentResult)));
    // console.log(ointment_details);

    callback(ointment_details);
  });
}

module.exports = { ExecuteQuery };