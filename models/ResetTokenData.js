async function getQuery() {
	const sql = "DELETE FROM patienttokennumbers;";

	return sql;
}

async function ExecuteQuery(db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const sql = await getQuery();
		console.log(sql);

		await conn.query(sql);
    
		await conn.commit();
		console.log('Transaction committed ResetTokenData.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };