async function getQuery(PaymentID, Payment_HashValue) {
  let sql = "SELECT * FROM `patientpaymentsidentifiers` WHERE ";
  let value;
  if(PaymentID !== undefined) {
    value = PaymentID;
    sql += "PaymentID = ?;";
  } else if (Payment_HashValue !== undefined) {
    value = Payment_HashValue
    sql += "PaymentHashCode = ?;";
  }
  return [sql, value];
}

async function ExecuteQuery(PaymentID, Payment_HashValue, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, value] = await getQuery(PaymentID, Payment_HashValue);
		console.log(sql);

		const [rows] = await conn.query(sql, [value]);
		return rows;

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };