async function getQueryForPatientSearchGeneral(searchKeyword) {
	const sql = "SELECT * FROM patientdetails WHERE (LOWER(CaseNo) LIKE ? OR PhoneNumber LIKE ? OR LOWER(PatientName) LIKE ?) ORDER BY FirstVisit DESC LIMIT 10;";
	const searchKeywordParam = `%${searchKeyword.toLowerCase()}%`;
	const values = [searchKeywordParam, searchKeywordParam, searchKeywordParam];

	return [sql, values];
}

async function getQueryForPatientSearchToken(searchKeyword) {
	const sql = "SELECT * FROM patientdetails WHERE (LOWER(CaseNo) LIKE ? OR PhoneNumber LIKE ? OR LOWER(PatientName) LIKE ?) AND PatientID NOT IN (SELECT PatientID FROM patienttokennumbers WHERE PatientID IS NOT NULL) ORDER BY FirstVisit DESC LIMIT 10;";
	const searchKeywordParam = `%${searchKeyword.toLowerCase()}%`;
	const values = [searchKeywordParam, searchKeywordParam, searchKeywordParam];

	return [sql, values];
}

async function getQueryForPatientInfo(searchKeyword) {
	const sql = "SELECT * FROM patientdetails WHERE PatientID = ? ORDER BY FirstVisit DESC LIMIT 10;";
	const values = [searchKeyword];

	return [sql, values];
}

async function ExecuteQuery(searchKeyword, searchMode, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		let sql, values;
		switch (searchMode) {
			case "PatientSearch":
				[sql, values] = await getQueryForPatientSearchGeneral(searchKeyword);
				break;
			case "PatientInfo":
				[sql, values] = await getQueryForPatientInfo(searchKeyword);
				break;
			case "Token_PatientSearch":
				[sql, values] = await getQueryForPatientSearchToken(searchKeyword);
				break;
			default:
				console.log("Invalid search option");
				return []
		}
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