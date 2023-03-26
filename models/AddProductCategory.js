async function getQuery(CategoryName) {
	const sql = "INSERT INTO productcategory(`CategoryName`) VALUES(?);";
	const values = [CategoryName];

	return [sql, values];
}

async function ExecuteQuery(CategoryName, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(CategoryName);
  	console.log(sql, values);

		await conn.query(sql, values);
    
    await conn.commit();
		console.log('Transaction committed AddProductCategory.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };