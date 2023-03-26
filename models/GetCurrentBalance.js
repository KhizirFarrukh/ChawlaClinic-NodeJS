async function getQuery(id) {
	const sql = "SELECT SUM(TotalAmount) AS \"total\",SUM(AmountPaid) AS \"paid\",SUM(AmountReduction) AS \"discount\" from patientpaymentrecord where PatientID = ?;";
	const values = [id];

	return [sql, values];
}

async function ExecuteQuery(id, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(id);
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