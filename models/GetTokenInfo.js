async function getMaxCountQuery(TokenType) {
	const sql = "SELECT max(TokenNumber) AS \"MaxTokenNum\" FROM patienttokennumbers WHERE TokenType = ?;";;
	const values = [TokenType];

	return [sql, values];
}

async function getDetailsQuery(TokenType) {
	const sql = "SELECT TokenID, TokenNumber, PatientID, PatientName FROM patienttokennumbers WHERE TokenType = ?;";
	const values = [TokenType];

	return [sql, values];
}

async function ExecuteQuery(db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [getMaxMaleCount_SQL, getMaxMaleCount_Values] = await getMaxCountQuery("Male");
		console.log(getMaxMaleCount_SQL, getMaxMaleCount_Values);

		const [getMaxMaleCount_Rows] = await conn.query(getMaxMaleCount_SQL, getMaxMaleCount_Values);

    const [getMaxFemaleCount_SQL, getMaxFemaleCount_Values] = await getMaxCountQuery("Female");
		console.log(getMaxFemaleCount_SQL, getMaxFemaleCount_Values);

		const [getMaxFemaleCount_Rows] = await conn.query(getMaxFemaleCount_SQL, getMaxFemaleCount_Values);

    const [getMaxChildCount_SQL, getMaxChildCount_Values] = await getMaxCountQuery("Child");
		console.log(getMaxMaleCount_SQL, getMaxMaleCount_Values);

		const [getMaxChildCount_Rows] = await conn.query(getMaxChildCount_SQL, getMaxChildCount_Values);

    const [getMaleDetails_SQL, getMaleDetails_Values] = await getDetailsQuery("Male");
		console.log(getMaleDetails_SQL, getMaleDetails_Values);

		const [getMaleDetails_Rows] = await conn.query(getMaleDetails_SQL, getMaleDetails_Values);

    const [getFemaleDetails_SQL, getFemaleDetails_Values] = await getDetailsQuery("Female");
		console.log(getFemaleDetails_SQL, getFemaleDetails_Values);

		const [getFemaleDetails_Rows] = await conn.query(getFemaleDetails_SQL, getFemaleDetails_Values);

    const [getChildDetails_SQL, getChildDetails_Values] = await getDetailsQuery("Child");
		console.log(getChildDetails_SQL, getChildDetails_Values);

		const [getChildDetails_Rows] = await conn.query(getChildDetails_SQL, getChildDetails_Values);

    const TokenMaxCounts = { Male:getMaxMaleCount_Rows[0].MaxTokenNum, Female:getMaxFemaleCount_Rows[0].MaxTokenNum, Child:getMaxChildCount_Rows[0].MaxTokenNum }
		
    return [TokenMaxCounts, getMaleDetails_Rows, getFemaleDetails_Rows, getChildDetails_Rows];

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}

module.exports = { getMaxCountQuery, getDetailsQuery, ExecuteQuery };