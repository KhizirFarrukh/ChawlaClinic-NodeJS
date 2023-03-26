async function getQuery(id, ID_represents, arr_PaymentIDs) {
  let sql;
  const values = [id];
  if(ID_represents === "Patient") {
    const placeholders = arr_PaymentIDs.map(() => '?').join(',');
    sql = `SELECT prod.ProductName, oint.Quantity, oint.Amount, pay.PaymentID FROM products prod JOIN patientointmentpurchased oint on prod.ProductID = oint.ProductID JOIN patientproductspurchased prodpurchase ON oint.PurchaseID = prodpurchase.PurchaseID RIGHT JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID WHERE pay.PatientID = ? AND pay.PaymentID IN (${placeholders}) ORDER BY pay.PaymentID DESC;`;
    values.push(...arr_PaymentIDs); // this will result in an array that contains id as well as array of paymentIDs in one array
  } else if(ID_represents === "Payment") {
    sql = "SELECT prod.ProductName, oint.Quantity, oint.Amount, pay.PaymentID FROM products prod JOIN patientointmentpurchased oint on prod.ProductID = oint.ProductID JOIN patientproductspurchased prodpurchase ON oint.PurchaseID = prodpurchase.PurchaseID RIGHT JOIN patientpaymentrecord pay ON prodpurchase.PaymentID = pay.PaymentID WHERE pay.PaymentID = ?;";
  }
  return [sql, values];
}

async function ExecuteQuery(id, ID_represents, arr_PaymentIDs, db_pool) {
  if(arr_PaymentIDs.length === 0) {
    return [];
  } else {
    let conn;
    try {
      conn = await db_pool.getConnection();
      await conn.beginTransaction();

      const [sql, values] = await getQuery(id, ID_represents, arr_PaymentIDs);
      console.log(sql, values);

      const [rows] = await conn.query(sql, values);
      return rows;

    } catch (error) {
      if (conn) { await conn.rollback(); }
      throw error;
    } finally {
      if (conn) { conn.release(); }
    }
  }
}
module.exports = { ExecuteQuery };