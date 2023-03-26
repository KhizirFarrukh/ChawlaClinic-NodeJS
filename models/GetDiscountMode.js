async function getQuery(PatientID) {
	const sql = "SELECT DiscountMode FROM patientdetails where PatientID = ?;";
	const values = [PatientID];

	return [sql, values];
}

async function ExecuteQuery(PatientID, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(PatientID);
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