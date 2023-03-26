async function getQuery(data_ProductPrice, LastUpdatedDate, data_ProductQty, data_SaveProduct) {
	const sql = "UPDATE products prod JOIN productinventory invent ON prod.ProductID = invent.ProductID SET prod.ProductPrice = ?, prod.LastUpdated = STR_TO_DATE(?,'%Y-%m-%d'), invent.Quantity = ?, invent.LastUpdated = STR_TO_DATE(?,'%Y-%m-%d') where prod.ProductID = ?;";
	const values = [data_ProductPrice, LastUpdatedDate, data_ProductQty, LastUpdatedDate, data_SaveProduct];
	
	return [sql, values];
}

async function ExecuteQuery(data, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const currentDate = new Date();
    const LastUpdatedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');
    
    const [sql, values] = await getQuery(data.ProductPrice, LastUpdatedDate, data.ProductQty, data.SaveProduct);
		console.log(sql, values);

		await conn.query(sql, values);
    
    await conn.commit();
		console.log('Transaction committed UpdateProduct.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };