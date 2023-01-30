function ExecuteQuery(id, arr_PaymentIDs, con, callback) {
  const PaymentID_Match_Values = '(' + arr_PaymentIDs.join(', ') + ')';

  const products_sql = "SELECT prod.ProductName, proditem.Quantity, proditem.Amount, pay.PaymentID FROM products prod JOIN patientotherprodspurchased proditem on prod.ProductID = proditem.ProductID JOIN patientproductspurchased prodpurchase ON proditem.PurchaseID = prodpurchase.PurchaseID RIGHT JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID WHERE pay.PatientID = " + id + " AND pay.PaymentID IN " + PaymentID_Match_Values + " ORDER BY pay.PaymentID DESC;";

  console.log(products_sql);

  con.query(products_sql, function (err, productsResult) {
    if (err) throw err;

    var product_details = Object.values(JSON.parse(JSON.stringify(productsResult)));

    callback(product_details);
  });
}

module.exports = { ExecuteQuery };