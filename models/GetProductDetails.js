const mysql = require('mysql');

function ExecuteQuery(id, retrieveLimit, con, callback) {
  // var payment_sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction AS \"Discount\", pay.Date, SUM(ointmentpurchase.Amount) AS \"OintmentCharges\", dressing.TotalAmount AS \"DressingCharges\" from patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID where pay.PatientID = " + id + " group by ointmentpurchase.PurchaseID order by pay.PaymentID"

  var ointment_sql = "";

  if(retrieveLimit == true ) {
    products_sql = "SELECT prod.ProductName, proditem.Quantity, proditem.Amount, pay.PaymentID FROM products prod JOIN patientotherprodspurchased proditem on prod.ProductID = proditem.ProductID JOIN patientproductspurchased prodpurchase ON proditem.PurchaseID = prodpurchase.PurchaseID RIGHT JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID JOIN (SELECT PaymentID FROM patientpaymentrecord WHERE PatientID = " + id + " ORDER BY PaymentID DESC LIMIT 5) AS subq ON subq.PaymentID = pay.PaymentID WHERE pay.PatientID = " + id + " ORDER BY pay.PaymentID DESC;";
  } else {
    products_sql = "SELECT prod.ProductName, proditem.Quantity, proditem.Amount, pay.PaymentID FROM products prod JOIN patientotherprodspurchased proditem on prod.ProductID = proditem.ProductID JOIN patientproductspurchased prodpurchase ON proditem.PurchaseID = prodpurchase.PurchaseID RIGHT JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID WHERE pay.PatientID = " + id + " ORDER BY pay.PaymentID DESC;";
  }

  console.log(products_sql);

  con.query(products_sql, function (err, productsResult) {
    if (err) throw err;

    var product_details = Object.values(JSON.parse(JSON.stringify(productsResult)));
    // console.log(product_details);

    callback(product_details);
  });
}

module.exports = { ExecuteQuery };