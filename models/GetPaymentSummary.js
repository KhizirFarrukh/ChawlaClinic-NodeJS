async function getQuery(PaymentID) {
	const sql = "SELECT pay.PaymentID, payid.PaymentHashCode, pay.TotalAmount, pay.AmountPaid, pay.Date from patientpaymentrecord pay left join patientpaymentsidentifiers payid on pay.PaymentID = payid.PaymentID where pay.PaymentID = ?;";
	const values = [PaymentID];

	return [sql, values];
}

async function ExecuteQuery(PaymentID, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(PaymentID);
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
module.exports = { ExecuteQuery };