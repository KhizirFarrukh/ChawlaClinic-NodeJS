async function getQuery() {
	const sql = "SELECT * FROM `productcategory` WHERE CategoryName != 'Dressing Pad' ORDER BY LOWER(`CategoryName`) ASC;";

	return sql;
}

async function ExecuteQuery(db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const sql = await getQuery();
		console.log(sql);

		const [rows] = await conn.query(sql);
		return rows;

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };