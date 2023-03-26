async function getQuery(TokenID) {
	const sql = "SELECT patient.CaseNo, token.TokenNumber, token.TokenType, token.TokenDateTime FROM patienttokennumbers token LEFT JOIN patientdetails patient ON token.PatientID = patient.PatientID WHERE token.TokenID = ?;";
	const values = [TokenID];

	return [sql, values];
}

async function ExecuteQuery(TokenID, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(TokenID);
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