async function getQuery(ProductID) {
	const sql = "DELETE FROM `discontinuedproducts` WHERE ProductID = ?;";
	const values = [ProductID];

	return [sql, values];
}

async function ExecuteQuery(ProductID, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(ProductID);
    console.log(sql, values);

		await conn.query(sql, values);
    
    await conn.commit();
		console.log('Transaction committed RemoveDiscontinuedProduct.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };