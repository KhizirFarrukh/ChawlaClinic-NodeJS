async function getQuery(TempID) {
	const sql = "DELETE FROM patientdressingtemphold WHERE TempID = ?;";
	const values = [TempID];

	return [sql, values];
}

async function ExecuteQuery(TempID, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(TempID);
		console.log(sql, values);

		await conn.query(sql, values);

		await conn.commit();
		console.log('Transaction committed RemoveTempDressingHold.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };